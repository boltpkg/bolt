// @flow
import type {Args, Opts} from '../types';
import Project from '../Project';
import * as processes from '../utils/processes';
import * as fs from '../utils/fs';
import * as path from 'path';
import * as logger from '../utils/logger';
import * as messages from '../utils/messages';

export default async function install(args: Args, opts: Opts) {
  let cwd = process.cwd();
  let project = await Project.init(cwd);
  let workspaces = await project.getWorkspaces();

  let {
    graph: dependencyGraph,
    valid: dependencyGraphValid,
  } = await project.getDependencyGraph(workspaces);

  let projectNodeModules = path.join(project.pkg.dir, 'node_modules');
  let projectDependencies = project.pkg.getAllDependencies();

  let nodeModulesToCreate = [];
  let symlinksToCreate = [];
  let valid = true;

  for (let workspace of workspaces) {
    let nodeModules = path.join(workspace.pkg.dir, 'node_modules');
    let dependencies = workspace.pkg.getAllDependencies();

    nodeModulesToCreate.push(nodeModules);

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

      let src = path.join(projectNodeModules, name);
      let dest = path.join(nodeModules, name);

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
    await workspace.pkg.runScript('preinstall');
  });

  logger.log('[1/2] Installing project dependencies...');

  await processes.spawn('yarn', ['install', '--non-interactive', '-s']);

  logger.log('[2/2] Linking workspace dependencies...');

  await Promise.all(nodeModulesToCreate.map(dirName => {
    return fs.mkdirp(dirName);
  }));

  await Promise.all(symlinksToCreate.map(async ({ src, dest, type }) => {
    await fs.symlink(src, dest, type);
  }));

  await Project.runWorkspaceTasks(workspaces, async workspace => {
    await workspace.pkg.runScript('postinstall');
    await workspace.pkg.runScript('prepublish');
  });

  logger.success('Installed and linked workspaces.');
}
