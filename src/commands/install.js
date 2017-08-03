// @flow
import type {Args, Opts} from '../types';
import Project from '../Project';
import spawn from '../utils/spawn';
import symlink from '../utils/symlink';
import mkdirp from '../utils/mkdirp';
import {join} from 'path';
import * as logger from '../logger';
import runWorkspaceTasks from '../utils/runWorkspaceTasks';
import runWorkspaceScript from '../utils/runWorkspaceScript';

export default async function install(args: Args, opts: Opts) {
  let cwd = process.cwd();
  let project = await Project.init(cwd);
  let workspaces = await project.getWorkspaces();
  let dependencyGraph = await project.getDependencyGraph(workspaces);

  await runWorkspaceTasks(workspaces, async workspace => {
    await runWorkspaceScript(workspace, 'preinstall');
  });

  logger.log('[1/3] Installing project dependencies...');

  await spawn('yarn', ['install', '--non-interactive', '-s']);

  logger.log('[2/3] Linking workspace dependencies...');

  let projectNodeModules = join(project.pkg.dir, 'node_modules');
  let projectDependencies = project.pkg.getAllDependencies();

  let symlinks = [];

  for (let workspace of workspaces) {
    let nodeModules = join(workspace.pkg.dir, 'node_modules');
    let dependencies = workspace.pkg.getAllDependencies();

    await mkdirp(nodeModules);

    for (let [name, version] of dependencies) {
      let matched = projectDependencies.get(name);

      if (dependencyGraph.has(name)) continue;
      if (!matched) throw new Error(`Dependency ${name} in ${workspace.pkg.config.name} must be added to project dependencies.`);
      if (version !== matched) throw new Error(`Dependency ${name} in ${workspace.pkg.config.name} must match version in project dependencies. ${matched} vs ${version}`);

      let src = join(projectNodeModules, name);
      let dest = join(nodeModules, name);

      symlinks.push(symlink(src, dest, 'junction'));
    }
  }

  logger.log('[3/3] Linking workspace cross-dependencies...');

  for (let [name, node] of dependencyGraph) {
    let nodeModules = join(node.pkg.dir, 'node_modules');

    for (let dependency of node.dependencies) {
      let depWorkspace = dependencyGraph.get(dependency);
      if (!depWorkspace) throw new Error(`Missing workspace: ${dependency}`);
      let src = depWorkspace.pkg.dir;
      let dest = join(nodeModules, dependency);

      symlinks.push(symlink(src, dest, 'junction'));
    }
  }

  await Promise.all(symlinks);

  await runWorkspaceTasks(workspaces, async workspace => {
    await runWorkspaceScript(workspace, 'postinstall');
    await runWorkspaceScript(workspace, 'prepublish');
  });

  logger.success('Installed and linked workspaces.');
}
