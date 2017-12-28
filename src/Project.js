// @flow
import * as path from 'path';
import includes from 'array-includes';
import semver from 'semver';
import Package from './Package';
import Workspace from './Workspace';
import Config from './Config';
import type { FilterOpts } from './types';
import * as fs from './utils/fs';
import * as logger from './utils/logger';
import * as messages from './utils/messages';
import { BoltError } from './utils/errors';
import * as globs from './utils/globs';
import taskGraphRunner from 'task-graph-runner';
import minimatch from 'minimatch';
import Repository from './Repository';
import DependencyGraph from './DependencyGraph';

export type Task = (workspace: Workspace) => Promise<mixed>;

export type DepGraph = Map<
  Workspace,
  {
    dependencies: Set<Workspace>,
    dependents: Set<Workspace>
  }
>;

export default class Project {
  pkg: Package;

  constructor(pkg: Package) {
    this.pkg = pkg;
  }

  static async init(cwd: string) {
    let realPath = await fs.realpath(cwd);
    let filePath = await Config.getProjectConfig(realPath);
    if (!filePath) {
      throw new BoltError(`Unable to find root of project in ${cwd}`);
    }
    let pkg = await Package.init(filePath);
    return new Project(pkg);
  }

  async getWorkspaces() {
    let queue = [this.pkg];
    let workspaces = [];

    for (let pkg of queue) {
      let cwd = path.dirname(pkg.filePath);
      let patterns = pkg.getWorkspacesConfig();
      let matchedPaths = await globs.findWorkspaces(cwd, patterns);

      for (let matchedPath of matchedPaths) {
        let dir = path.join(cwd, matchedPath);
        let stats = await fs.stat(dir);
        if (!stats.isDirectory()) continue;

        let filePath = path.join(dir, 'package.json');
        let wPkg = await Package.init(filePath);
        let workspace = await Workspace.init(wPkg);

        queue.push(wPkg);
        workspaces.push(workspace);
      }
    }

    return workspaces;
  }

  async runWorkspaceTasks(workspaces: Array<Workspace>, task: Task) {
    let depGraph = new DependencyGraph(this, workspaces);
    let graph = new Map();

    for (let [workspace, { dependencies }] of depGraph.entries()) {
      graph.set(workspace, Array.from(dependencies));
    }

    let { safe } = await taskGraphRunner({
      graph,
      force: true,
      task
    });

    if (!safe) {
      logger.warn(messages.unsafeCycles());
    }
  }

  getWorkspaceByName(workspaces: Array<Workspace>, workspaceName: string) {
    return workspaces.find(workspace => {
      return workspace.pkg.config.getName() === workspaceName;
    });
  }

  filterWorkspaces(workspaces: Array<Workspace>, opts: FilterOpts) {
    let relativeDir = (workspace: Workspace) =>
      path.relative(this.pkg.dir, workspace.pkg.dir);

    let workspaceNames = workspaces.map(ws => ws.pkg.config.getName());
    let workspaceDirs = workspaces.map(ws => relativeDir(ws));

    let filteredByName = globs.matchOnlyAndIgnore(
      workspaceNames,
      opts.only,
      opts.ignore
    );

    let filteredByDir = globs.matchOnlyAndIgnore(
      workspaceDirs,
      opts.onlyFs,
      opts.ignoreFs
    );

    let filteredWorkspaces = workspaces.filter(
      workspace =>
        includes(filteredByName, workspace.pkg.config.getName()) &&
        includes(filteredByDir, relativeDir(workspace))
    );

    if (filteredWorkspaces.length === 0) {
      logger.warn(messages.noPackagesMatchFilters());
    }

    return filteredWorkspaces;
  }
}
