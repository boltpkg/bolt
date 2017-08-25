// @flow
import type {Args, Opts} from '../types';
import Project from '../Project';
import * as processes from '../utils/processes';
import * as fs from '../utils/fs';
import * as path from 'path';
import * as logger from '../utils/logger';
import * as messages from '../utils/messages';
import * as yarn from '../utils/yarn';
import pathIsInside from 'path-is-inside';

export default async function install(args: Args, opts: Opts) {
  let cwd = process.cwd();
  let project = await Project.init(cwd);
  let workspaces = await project.getWorkspaces();

  let {
    graph: dependencyGraph,
    valid: dependencyGraphValid,
  } = await project.getDependencyGraph(workspaces);

  let projectDependencies = project.pkg.getAllDependencies();

  let directoriesToCreate = [];
  let symlinksToCreate = [];
  let valid = true;

  let workspacesToDependencies = {};

  for (let workspace of workspaces) {
    let dependencies = workspace.pkg.getAllDependencies();

    workspacesToDependencies[workspace.pkg.config.name] = dependencies;

    directoriesToCreate.push(workspace.pkg.nodeModules);
    directoriesToCreate.push(workspace.pkg.nodeModulesBin);

    for (let [name, version] of dependencies) {
      let matched = projectDependencies.get(name);

      if (dependencyGraph.has(name)) {
        continue;
      }

      if (!matched) {
        valid = false;
        logger.error(messages.depMustBeAddedToProject(workspace.pkg.config.name, name));
        continue;
      }

      if (version !== matched) {
        valid = false;
        logger.error(messages.depMustMatchProject(workspace.pkg.config.name, name, matched, version));
        continue;
      }

      let src = path.join(project.pkg.nodeModules, name);
      let dest = path.join(workspace.pkg.nodeModules, name);

      symlinksToCreate.push({ src, dest, type: 'junction' });
    }
  }

  for (let [name, node] of dependencyGraph) {
    let nodeModules = path.join(node.pkg.dir, 'node_modules');

    for (let dependency of node.dependencies) {
      let depWorkspace = dependencyGraph.get(dependency);

      if (!depWorkspace) {
        throw new Error(`Missing workspace: "${dependency}"`);
      }

      let src = depWorkspace.pkg.dir;
      let dest = path.join(nodeModules, dependency);

      symlinksToCreate.push({ src, dest, type: 'junction' });
    }
  }

  if (!dependencyGraphValid || !valid) {
    throw new Error('Cannot symlink invalid set of dependencies.');
  }

  await Project.runWorkspaceTasks(workspaces, async workspace => {
    await yarn.run(workspace.pkg, 'preinstall');
  });

  logger.log('[1/2] Installing project dependencies...');

  await processes.spawn('yarn', ['install', '--non-interactive', '-s'], {
    cwd: project.pkg.dir,
  });

  logger.log('[2/2] Linking workspace dependencies...');

  for (let binFile of await fs.readdir(project.pkg.nodeModulesBin)) {
    let binPath = path.join(project.pkg.nodeModulesBin, binFile);
    let binName = path.basename(binPath);

    let linkFile = await fs.readlink(binPath);

    if (!linkFile) {
      throw new Error(`${binName} is not a symlink`);
    }

    let linkPath = path.join(project.pkg.nodeModulesBin, linkFile);

    if (!pathIsInside(linkPath, project.pkg.nodeModules)) {
      throw new Error(`${binName} is linked to a location outside of project node_modules: ${linkPath}`);
    }

    let relativeLinkPath = path.relative(project.pkg.nodeModules, linkPath);
    let pathParts = relativeLinkPath.split(path.sep);
    let pkgName = pathParts[0];

    if (pkgName.startsWith('@')) {
      pkgName += '/' + pathParts[1];
    }

    for (let workspace of workspaces) {
      let dependencies = workspacesToDependencies[workspace.pkg.config.name];

      if (!dependencies.has(pkgName)) {
        continue;
      }

      let workspaceBinPath = path.join(workspace.pkg.nodeModulesBin, binName);

      symlinksToCreate.push({
        src: binPath,
        dest: workspaceBinPath,
        type: 'exec',
      });
    }
  }

  await Promise.all(directoriesToCreate.map(dirName => {
    return fs.mkdirp(dirName);
  }));

  await Promise.all(symlinksToCreate.map(async ({ src, dest, type }) => {
    await fs.symlink(src, dest, type);
  }));

  await Project.runWorkspaceTasks(workspaces, async workspace => {
    await yarn.run(workspace.pkg, 'postinstall');
    await yarn.run(workspace.pkg, 'prepublish');
  });

  logger.success('Installed and linked workspaces.');
}
