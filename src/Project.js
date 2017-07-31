// @flow
import {join, dirname} from 'path';
import globby from 'globby';

import Package from './Package';
import Workspace from './Workspace';
import type {Config} from './types';
import findConfig from './utils/findConfig';
import readConfig from './utils/readConfig';

async function getRootWorkspaceConfig(cwd: string) {
  let searching = cwd;

  while (searching) {
    let filePath = await findConfig(searching);

    if (filePath) {
      let config = await readConfig(filePath);
      if (config && config.pworkspaces) {
        return filePath;
      }
      searching = dirname(dirname(filePath));
    } else {
      return null;
    }
  }
}

export default class Project {
  pkg: Package;

  constructor(pkg: Package) {
    this.pkg = pkg;
  }

  static async init(cwd: string) {
    let filePath = await getRootWorkspaceConfig(cwd);
    if (!filePath) throw new Error(`Unable to find workspace root of project in ${cwd}`);
    let pkg = await Package.init(filePath);
    return new Project(pkg);
  }

  async getWorkspaces() {
    let queue = [this.pkg];
    let workspaces = [];

    for (let pkg of queue) {
      let cwd = dirname(pkg.filePath);
      let patterns = this.pkg.getWorkspacesConfig();
      let matchedPaths: Array<string> = await globby(patterns, { cwd });

      for (let matchedPath of matchedPaths) {
        let filePath = join(cwd, matchedPath, 'package.json');
        let wPkg = await Package.init(filePath);
        let workspace = await Workspace.init(wPkg);

        queue.push(wPkg);
        workspaces.push(workspace);
      }
    }

    return workspaces;
  }

  async getDependencyGraph(workspaces: Array<Workspace>) {
    let graph = new Map();
    let packages = [this.pkg];
    let packagesByName = { [this.pkg.config.name]: this.pkg };

    for (let workspace of workspaces) {
      packages.push(workspace.pkg);
      packagesByName[workspace.pkg.config.name] = workspace.pkg;
    }

    for (let pkg of packages) {
      let name = pkg.config.name;
      let dependencies = [];
      let allDependencies = pkg.getAllDependencies();

      for (let [depName, depVersion] of allDependencies) {
        let match = packagesByName[depName];
        if (!match) continue;

        let actual = depVersion.replace(/^\^/, '');;
        let expected = match.config.version

        if (actual !== expected) {
          throw new Error(`Package ${name} must depend on the current version of ${depName}. ${expected} vs ${actual}`);
        }

        dependencies.push(depName);
      }

      graph.set(name, { pkg, dependencies });
    }

    return graph;
  }
}
