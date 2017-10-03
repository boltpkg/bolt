// @flow
import path from 'path';
import pathIsInside from 'path-is-inside';
import includes from 'array-includes';

import Project from '../Project';
import type Workspace from '../Workspace';
import type Package from '../Package';
import { BoltError } from './errors';
import * as fs from './fs';
import * as logger from './logger';
import * as messages from './messages';
import * as yarn from './yarn';

export default async function symlinkPackageDependencies(
  project: Project,
  pkg: Package,
  dependencies: Array<string>
) {
  const projectDeps = project.pkg.getAllDependencies();
  const pkgDependencies = project.pkg.getAllDependencies();
  const workspaces = await project.getWorkspaces();
  const {
    graph: dependencyGraph,
    valid: dependencyGraphValid
  } = await project.getDependencyGraph(workspaces);
  const pkgName = pkg.config.getName();
  // get all the dependencies that are internal workspaces in this project
  const internalDeps = (dependencyGraph.get(pkgName) || {}).dependencies || [];

  const directoriesToCreate = [];
  const symlinksToCreate = [];

  let valid = true;

  /*********************************************************************
   * Calculate all the external dependencies that need to be symlinked *
  **********************************************************************/

  directoriesToCreate.push(pkg.nodeModules, pkg.nodeModulesBin);

  for (let depName of dependencies) {
    const versionInProject = project.pkg.getDependencyVersionRange(depName);
    const versionInPkg = pkg.getDependencyVersionRange(depName);

    // If dependency is internal we can ignore it (we symlink below)
    if (dependencyGraph.has(depName)) {
      continue;
    }

    if (!versionInProject) {
      valid = false;
      logger.error(
        messages.depMustBeAddedToProject(pkg.config.getName(), depName)
      );
      continue;
    }

    if (!versionInPkg) {
      valid = false;
      logger.error(
        messages.couldntSymlinkDependencyNotExists(
          pkg.config.getName(),
          depName
        )
      );
      continue;
    }

    if (versionInProject !== versionInPkg) {
      valid = false;
      logger.error(
        messages.depMustMatchProject(
          pkg.config.getName(),
          depName,
          versionInProject,
          versionInPkg
        )
      );
      continue;
    }

    let src = path.join(project.pkg.nodeModules, depName);
    let dest = path.join(pkg.nodeModules, depName);

    symlinksToCreate.push({ src, dest, type: 'junction' });
  }

  /*********************************************************************
   * Calculate all the internal dependencies that need to be symlinked *
  **********************************************************************/

  for (let dependency of internalDeps) {
    const depWorkspace = dependencyGraph.get(dependency) || {};
    const src = depWorkspace.pkg.dir;
    const dest = path.join(pkg.nodeModules, dependency);

    symlinksToCreate.push({ src, dest, type: 'junction' });
  }

  if (!dependencyGraphValid || !valid) {
    throw new BoltError('Cannot symlink invalid set of dependencies.');
  }

  /********************************************************
   * Calculate all the bin files that need to be symlinked *
  *********************************************************/
  const projectBinFiles = await fs.readdirSafe(project.pkg.nodeModulesBin);

  // TODO: For now, we'll search through each of the bin files in the Project and find which ones are
  // dependencies we are symlinking. In the future, we should really be going through each dependency
  // and all of its dependencies and checking which ones expose bins so that all the transitive ones
  // are included too

  for (let binFile of projectBinFiles) {
    const binPath = path.join(project.pkg.nodeModulesBin, binFile);
    const binName = path.basename(binPath);

    // read the symlink to find the actual bin file (path will be relative to the symlink)
    const actualBinFileRelative = await fs.readlink(binPath);

    if (!actualBinFileRelative) {
      throw new BoltError(`${binName} is not a symlink`);
    }

    const actualBinFile = path.join(
      project.pkg.nodeModulesBin,
      actualBinFileRelative
    );

    if (!pathIsInside(actualBinFile, project.pkg.nodeModules)) {
      throw new BoltError(
        `${binName} is linked to a location outside of project node_modules: ${actualBinFileRelative}`
      );
    }

    // To find the name of the dep that created the bin we'll get its path from node_modules and
    // use the first one or two parts (two if the package is scoped)
    const binFileRelativeToNodeModules = path.relative(
      project.pkg.nodeModules,
      actualBinFile
    );
    const pathParts = binFileRelativeToNodeModules.split(path.sep);
    let pkgName = pathParts[0];

    if (pkgName.startsWith('@')) {
      pkgName += '/' + pathParts[1];
    }

    let workspaceBinPath = path.join(pkg.nodeModulesBin, binName);

    symlinksToCreate.push({
      src: binPath,
      dest: workspaceBinPath,
      type: 'exec'
    });
  }

  /*****************************************************************
   * Calculate all the internal bin files that need to be symlinked *
  ******************************************************************/

  // TODO: Same as above, we should really be making sure we get all the transitive bins as well

  for (let dependency of internalDeps) {
    const depWorkspace = dependencyGraph.get(dependency) || {};
    const depBinFiles =
      depWorkspace.pkg &&
      depWorkspace.pkg.config &&
      depWorkspace.pkg.config.getBin();

    if (!depBinFiles) {
      continue;
    }

    if (!includes(dependencies, dependency)) {
      // dependency is not one we are supposed to symlink right now
      continue;
    }

    if (typeof depBinFiles === 'string') {
      // package may be scoped, name will only be the second part
      const binName = dependency.split('/').pop();
      const src = path.join(depWorkspace.pkg.dir, depBinFiles);
      const dest = path.join(pkg.nodeModulesBin, binName);

      symlinksToCreate.push({ src, dest, type: 'exec' });
      continue;
    }

    for (let [binName, binPath] of Object.entries(depBinFiles)) {
      const src = path.join(depWorkspace.pkg.dir, String(binPath));
      const dest = path.join(pkg.nodeModulesBin, binName);

      symlinksToCreate.push({ src, dest, type: 'exec' });
    }
  }

  /**********************************
   * Create directories and symlinks *
  ***********************************/

  await yarn.run(pkg, 'preinstall');

  await Promise.all(
    directoriesToCreate.map(dirName => {
      return fs.mkdirp(dirName);
    })
  );

  await Promise.all(
    symlinksToCreate.map(async ({ src, dest, type }) => {
      await fs.symlink(src, dest, type);
    })
  );

  await yarn.run(pkg, 'postinstall');
  await yarn.run(pkg, 'prepublish');
}
