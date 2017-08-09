// @flow
import * as path from 'path';
import {readConfigFile} from './utils/config';
import type {Config} from './types';
import {DEPENDENCY_TYPES} from './constants';
import * as processes from './utils/processes';

export default class Package {
  filePath: string;
  dir: string;
  contents: string;
  config: Config;
  indent: string;

  constructor(filePath: string, config: Config) {
    this.filePath = filePath;
    this.dir = path.dirname(filePath);
    this.config = config;
  }

  static async init(filePath: string) {
    let config = await readConfigFile(filePath);
    if (!config) {
      throw new Error(`Could not find package.json in ${filePath}`);
    }
    return new Package(filePath, config);
  }

  getWorkspacesConfig() {
    return this.config.pworkspaces || [];
  }

  getAllDependencies() {
    let allDependencies = new Map();

    for (let type of DEPENDENCY_TYPES) {
      let deps = this.config[type];
      if (!deps) continue;

      for (let name of Object.keys(deps)) {
        allDependencies.set(name, deps[name]);
      }
    }

    return allDependencies;
  }

  async runScript(script: string, args: Array<string> = []) {
    let spawnArgs = ['run', script, '-s'];

    if (args.length) {
      spawnArgs = spawnArgs.concat('--', args);
    }

    if (this.config.scripts && this.config.scripts[script]) {
      await processes.spawn('yarn', spawnArgs, {
        cwd: this.dir,
        pkg: this,
      });
    }
  }

  updateDependencyVersionRange(depName: string, versionRange: string) {
    for (let type of DEPENDENCY_TYPES) {
      let deps = this.config[type];
      if (!deps) continue;

      let currentVersionRange = deps[depName];
      if (!currentVersionRange) continue;

      console.log
    }
  }

}
