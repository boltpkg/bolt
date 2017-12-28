// @flow
import path from 'path';
import pathIsInside from 'path-is-inside';
import includes from 'array-includes';

import Project from '../Project';
import DependencyGraph from '../DependencyGraph';
import Workspace from '../Workspace';
import Package from '../Package';
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
  let projectDeps = project.pkg.getAllDependencies();
  let pkgDependencies = project.pkg.getAllDependencies();
  let workspaces = await project.getWorkspaces();
  let depGraph = new DependencyGraph(project, workspaces);
  let pkgName = pkg.config.getName();
  // get all the dependencies that are internal workspaces in this project
  let internalDeps = (depGraph.getDepsByName(pkgName) || {}).dependencies || [];

  let directoriesToCreate = [];
  let symlinksToCreate = [];

  let valid = true;

  /*********************************************************************
   * Calculate all the external dependencies that need to be symlinked *
  **********************************************************************/

  directoriesToCreate.push(pkg.nodeModules, pkg.nodeModulesBin);

  for (let depName of dependencies) {
    let versionInProject = project.pkg.getDependencyVersionRange(depName);
    let versionInPkg = pkg.getDependencyVersionRange(depName);

    // If dependency is internal we can ignore it (we symlink below)
    if (!!depGraph.getDepsByName(depName)) {
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
    let depWorkspace = depGraph.getDepsByWorkspace(dependency) || {};
    let src = dependency.pkg.dir;
    let dest = path.join(pkg.nodeModules, dependency.pkg.config.getName());

    symlinksToCreate.push({ src, dest, type: 'junction' });
  }

  if (!depGraph.isValid() || !valid) {
    throw new BoltError('Cannot symlink invalid set of dependencies.');
  }

  /********************************************************
   * Calculate all the bin files that need to be symlinked *
  *********************************************************/
  let projectBinFiles = await fs.readdirSafe(project.pkg.nodeModulesBin);

  // TODO: For now, we'll search through each of the bin files in the Project and find which ones are
  // dependencies we are symlinking. In the future, we should really be going through each dependency
  // and all of its dependencies and checking which ones expose bins so that all the transitive ones
  // are included too

  for (let binFile of projectBinFiles) {
    let binPath = path.join(project.pkg.nodeModulesBin, binFile);
    let binName = path.basename(binPath);

    // read the symlink to find the actual bin file (path will be relative to the symlink)
    let actualBinFileRelative = await fs.readlink(binPath);

    if (!actualBinFileRelative) {
      throw new BoltError(`${binName} is not a symlink`);
    }

    let actualBinFile = path.join(
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
    let binFileRelativeToNodeModules = path.relative(
      project.pkg.nodeModules,
      actualBinFile
    );
    let pathParts = binFileRelativeToNodeModules.split(path.sep);
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
    let depWorkspace = depGraph.getDepsByWorkspace(dependency) || {};
    let depBinFiles = dependency.pkg.config.getBin();
    if (!depBinFiles) continue;

    if (!includes(dependencies, dependency)) {
      // dependency is not one we are supposed to symlink right now
      continue;
    }

    if (typeof depBinFiles === 'string') {
      // package may be scoped, name will only be the second part
      let binName = dependency.pkg.config
        .getName()
        .split('/')
        .pop();
      let src = path.join(dependency.pkg.dir, depBinFiles);
      let dest = path.join(pkg.nodeModulesBin, binName);

      symlinksToCreate.push({ src, dest, type: 'exec' });
      continue;
    }

    for (let [binName, binPath] of Object.entries(depBinFiles)) {
      let src = path.join(dependency.pkg.dir, String(binPath));
      let dest = path.join(pkg.nodeModulesBin, binName);

      symlinksToCreate.push({ src, dest, type: 'exec' });
    }
  }

  /**********************************
   * Create directories and symlinks *
  ***********************************/

  await yarn.runIfExists(pkg, 'preinstall');

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

  await yarn.runIfExists(pkg, 'postinstall');
  await yarn.runIfExists(pkg, 'prepublish');
  await yarn.runIfExists(pkg, 'prepare');
}
