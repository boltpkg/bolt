// @flow
import path from 'path';
import pathIsInside from 'path-is-inside';
import includes from 'array-includes';

import Project from '../Project';
import type Workspace from '../Workspace';
import type Package from '../Package';
import { PError } from './errors';
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

  const directoriesToCreate = [];
  const symlinksToCreate = [];

  let valid = true;

  /*********************************************************************
   * Calculate all the external dependencies that need to be symlinked *
  **********************************************************************/

  directoriesToCreate.push(pkg.nodeModules, pkg.nodeModulesBin);

  for (let [name, version] of pkgDependencies) {
    const matched = projectDeps.get(name);

    // If dependency is internal we can ignore it
    if (dependencyGraph.has(name)) {
      continue;
    }

    // If dependency is not in the Project deps, warn user (but don't throw yet)
    if (!matched) {
      valid = false;
      logger.error(messages.depMustBeAddedToProject(pkg.config.name, name));
      continue;
    }

    if (version !== matched) {
      valid = false;
      logger.error(
        messages.depMustMatchProject(pkg.config.name, name, matched, version)
      );
      continue;
    }

    let src = path.join(project.pkg.nodeModules, name);
    let dest = path.join(pkg.nodeModules, name);

    symlinksToCreate.push({ src, dest, type: 'junction' });
  }

  /*********************************************************************
   * Calculate all the internal dependencies that need to be symlinked *
  **********************************************************************/

  for (let [name, node] of dependencyGraph) {
    const nodeModules = path.join(node.pkg.dir, 'node_modules');

    for (let dependency of node.dependencies) {
      const depWorkspace = dependencyGraph.get(dependency);

      if (!depWorkspace) {
        throw new PError(`Missing workspace: "${dependency}"`);
      }

      let src = depWorkspace.pkg.dir;
      let dest = path.join(nodeModules, dependency);

      symlinksToCreate.push({ src, dest, type: 'junction' });
    }
  }

  if (!dependencyGraphValid || !valid) {
    throw new PError('Cannot symlink invalid set of dependencies.');
  }

  /********************************************************
   * Calculate all the bin files that need to be symlinked *
  *********************************************************/

  for (let binFile of await fs.readdirSafe(project.pkg.nodeModulesBin)) {
    const binPath = path.join(project.pkg.nodeModulesBin, binFile);
    const binName = path.basename(binPath);

    const linkFile = await fs.readlink(binPath);

    if (!linkFile) {
      throw new PError(`${binName} is not a symlink`);
    }

    const linkPath = path.join(project.pkg.nodeModulesBin, linkFile);

    if (!pathIsInside(linkPath, project.pkg.nodeModules)) {
      throw new PError(
        `${binName} is linked to a location outside of project node_modules: ${linkPath}`
      );
    }

    const relativeLinkPath = path.relative(project.pkg.nodeModules, linkPath);
    const pathParts = relativeLinkPath.split(path.sep);
    let pkgName = pathParts[0];

    if (pkgName.startsWith('@')) {
      pkgName += '/' + pathParts[1];
    }

    if (!includes(dependencies, pkgName)) {
      continue;
    }

    let workspaceBinPath = path.join(pkg.nodeModulesBin, binName);

    symlinksToCreate.push({
      src: binPath,
      dest: workspaceBinPath,
      type: 'exec'
    });
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
