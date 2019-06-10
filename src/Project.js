// @flow
import * as path from 'path';
import includes from 'array-includes';
import semver from 'semver';
import Package from './Package';
import Config from './Config';
import type { SpawnOpts, FilterOpts } from './types';
import * as fs from './utils/fs';
import * as logger from './utils/logger';
import {
  promiseWrapper,
  promiseWrapperSuccess,
  type PromiseResult
} from './utils/promiseWrapper';
import * as messages from './utils/messages';
import { BoltError } from './utils/errors';
import * as globs from './utils/globs';
import taskGraphRunner from 'task-graph-runner';
import minimatch from 'minimatch';
import * as env from './utils/env';
import chunkd from 'chunkd';

type GenericTask<T> = (pkg: Package) => Promise<T>;

type TaskResult = PromiseResult<mixed>;

type InternalTask = GenericTask<TaskResult>;

export type Task = GenericTask<mixed>;

function taskWrapper(task: Task, bail?: boolean): InternalTask {
  if (bail === undefined || bail) {
    return promiseWrapperSuccess(task);
  } else {
    return promiseWrapper(task);
  }
}

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

  async getPackages() {
    let queue = [this.pkg];
    let packages = [];

    for (let item of queue) {
      let cwd = path.dirname(item.filePath);
      let patterns = item.getWorkspacesConfig();
      let matchedPaths = await globs.findWorkspaces(cwd, patterns);

      for (let matchedPath of matchedPaths) {
        let file = path.join(cwd, matchedPath);
        let stats = await fs.stat(file);
        if (!stats.isFile()) continue;

        let isPackage = path.basename(file) === 'package.json';
        if (!isPackage) continue;
        let pkg = await Package.init(file);

        queue.push(pkg);
        packages.push(pkg);

      }
    }

    return packages;
  }

  async getDependencyGraph(packages: Array<Package>) {
    let graph: Map<
      string,
      { pkg: Package, dependencies: Array<string> }
    > = new Map();
    let queue = [this.pkg];
    let packagesByName = { [this.pkg.getName()]: this.pkg };
    let valid = true;

    for (let pkg of packages) {
      queue.push(pkg);
      packagesByName[pkg.getName()] = pkg;
    }

    for (let pkg of queue) {
      let name = pkg.config.getName();
      let dependencies = [];
      let allDependencies = pkg.getAllDependencies();

      for (let [depName, depVersion] of allDependencies) {
        let match = packagesByName[depName];
        if (!match) continue;

        let actual = depVersion;
        let expected = match.config.getVersion();

        // Workspace dependencies only need to semver satisfy, not '==='
        if (!semver.satisfies(expected, depVersion)) {
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

  async getDependentsGraph(packages: Array<Package>) {
    let graph = new Map();
    let { valid, graph: dependencyGraph } = await this.getDependencyGraph(
      packages
    );

    let dependentsLookup: {
      [string]: { pkg: Package, dependents: Array<string> }
    } = {};

    packages.forEach(pkg => {
      dependentsLookup[pkg.config.getName()] = {
        pkg,
        dependents: []
      };
    });

    packages.forEach(pkg => {
      let dependent = pkg.getName();
      let valFromDependencyGraph = dependencyGraph.get(dependent) || {};
      let dependencies = valFromDependencyGraph.dependencies || [];

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

  async runPackageTasks(
    packages: Array<Package>,
    spawnOpts: SpawnOpts,
    task: Task
  ) {
    const wrappedTask = taskWrapper(task, spawnOpts.bail);
    let results: TaskResult[];
    if (spawnOpts.orderMode === 'serial') {
      results = await this.runPackageTasksSerial(packages, wrappedTask);
    } else if (spawnOpts.orderMode === 'parallel') {
      results = await this.runPackageTasksParallel(packages, wrappedTask);
    } else if (spawnOpts.orderMode === 'parallel-nodes') {
      results = await this.runPackageTasksParallelNodes(packages, wrappedTask);
    } else {
      results = await this.runPackageTasksGraphParallel(packages, wrappedTask);
    }

    results.forEach(r => {
      if (r.status === 'error') {
        throw r.error;
      }
    });
  }

  async runPackageTasksSerial<T>(
    packages: Array<Package>,
    task: GenericTask<T>
  ): Promise<Array<T>> {
    const results: Array<T> = [];
    for (let pkg of packages) {
      results.push(await task(pkg));
    }
    return results;
  }

  runPackageTasksParallel<T>(
    packages: Array<Package>,
    task: GenericTask<T>
  ): Promise<Array<T>> {
    return Promise.all(packages.map(pkg => task(pkg)));
  }

  async runPackageTasksParallelNodes<T>(
    packages: Array<Package>,
    task: GenericTask<T>
  ): Promise<Array<T>> {
    packages = packages.sort((a, b) => {
      return a.filePath.localeCompare(b.filePath, [], { numeric: true });
    });

    let index = env.get('CI_NODE_INDEX');
    let total = env.get('CI_NODE_TOTAL');

    if (typeof index === 'number' && typeof total === 'number') {
      let all = packages.length;
      packages = chunkd(packages, index, total);
      logger.info(
        messages.taskRunningAcrossCINodes(total, packages.length, all)
      );
    }

    return this.runPackageTasksParallel(packages, task);
  }

  async runPackageTasksGraphParallel<T>(
    packages: Array<Package>,
    task: GenericTask<T>
  ): Promise<Array<T>> {
    let { graph: dependentsGraph, valid } = await this.getDependencyGraph(
      packages
    );

    let graph = new Map();

    for (let [pkgName, pkgInfo] of dependentsGraph) {
      graph.set(pkgName, pkgInfo.dependencies);
    }

    let { safe, values } = await taskGraphRunner({
      graph,
      force: true,
      task: async pkgName => {
        let pkg = this.getPackageByName(packages, pkgName);
        if (pkg) {
          return task(pkg);
        }
      }
    });

    if (!safe) {
      logger.warn(messages.unsafeCycles());
    }
    return ((Object.values(values): any): Array<T>);
  }

  getPackageByName(packages: Array<Package>, pkgName: string) {
    return packages.find(pkg => pkg.getName() === pkgName);
  }

  filterPackages(packages: Array<Package>, opts: FilterOpts) {
    let relativeDir = (pkg: Package) => path.relative(this.pkg.dir, pkg.dir);

    let packageNames = packages.map(pkg => pkg.getName());
    let packageDirs = packages.map(pkg => relativeDir(pkg));

    let filteredByName = globs.matchOnlyAndIgnore(
      packageNames,
      opts.only,
      opts.ignore
    );

    let filteredByDir = globs.matchOnlyAndIgnore(
      packageDirs,
      opts.onlyFs,
      opts.ignoreFs
    );

    let filteredPackages = packages.filter(
      pkg =>
        includes(filteredByName, pkg.getName()) &&
        includes(filteredByDir, relativeDir(pkg))
    );

    if (filteredPackages.length === 0) {
      logger.warn(messages.noPackagesMatchFilters());
    }

    return filteredPackages;
  }
}
