// @flow
import * as path from 'path';
import includes from 'array-includes';
import Package from './Package';
import Workspace from './Workspace';
import Config from './Config';
import type { FilterOpts } from './types';
import * as fs from './utils/fs';
import * as logger from './utils/logger';
import * as messages from './utils/messages';
import { BoltError } from './utils/errors';
import * as globs from './utils/globs';

export type Task = (workspace: Workspace) => Promise<mixed>;

export default class Project {
  pkg: Package;

  constructor(pkg: Package) {
    this.pkg = pkg;
  }

  static async init(cwd: string) {
    let filePath = await Config.getProjectConfig(cwd);
    if (!filePath)
      throw new BoltError(`Unable to find root of project in ${cwd}`);
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

  async getDependencyGraph(workspaces: Array<Workspace>) {
    let graph: Map<
      string,
      { pkg: Package, dependencies: Array<string> }
    > = new Map();
    let packages = [this.pkg];
    let packagesByName = { [this.pkg.config.getName()]: this.pkg };
    let valid = true;

    for (let workspace of workspaces) {
      packages.push(workspace.pkg);
      packagesByName[workspace.pkg.config.getName()] = workspace.pkg;
    }

    for (let pkg of packages) {
      let name = pkg.config.getName();
      let dependencies = [];
      let allDependencies = pkg.getAllDependencies();

      for (let [depName, depVersion] of allDependencies) {
        let match = packagesByName[depName];
        if (!match) continue;

        let actual = depVersion.replace(/^\^/, '');
        let expected = match.config.getVersion();

        if (actual !== expected) {
          valid = false;
          logger.error(
            messages.packageMustDependOnCurrentVersion(
              name,
              depName,
              expected,
              depVersion
            )
          );
          continue;
        }

        dependencies.push(depName);
      }

      graph.set(name, { pkg, dependencies });
    }

    return { graph, valid };
  }

  async getDependentsGraph(workspaces: Array<Workspace>) {
    const graph = new Map();
    const { valid, graph: dependencyGraph } = await this.getDependencyGraph(
      workspaces
    );

    const dependentsLookup: {
      [string]: { pkg: Package, dependents: Array<string> }
    } = {};

    workspaces.forEach(workspace => {
      dependentsLookup[workspace.pkg.config.getName()] = {
        pkg: workspace.pkg,
        dependents: []
      };
    });

    workspaces.forEach(workspace => {
      const dependent = workspace.pkg.config.getName();
      const valFromDependencyGraph = dependencyGraph.get(dependent) || {};
      const dependencies = valFromDependencyGraph.dependencies || [];

      dependencies.forEach(dependency => {
        dependentsLookup[dependency].dependents.push(dependent);
      });
    });

    // can't use Object.entries here as the flow type for it is Array<[string, mixed]>;
    Object.keys(dependentsLookup).forEach(key => {
      graph.set(key, dependentsLookup[key]);
    });

    return { valid, graph };
  }

  // TODO: Properly sort packages using a topological sort, resolving cycles
  // with groups specified in `package.json#pworkspaces`
  static async runWorkspaceTasks(workspaces: Array<Workspace>, task: Task) {
    let promises = [];

    for (let workspace of workspaces) {
      promises.push(task(workspace));
    }

    await Promise.all(promises);
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
