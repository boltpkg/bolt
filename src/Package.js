// @flow
import * as path from 'path';
import {readConfigFile, writeConfigFile} from './utils/config';
import type {Config} from './types';
import {DEPENDENCY_TYPES} from './constants';
import * as processes from './utils/processes';
import * as semver from 'semver';
import * as logger from './utils/logger';
import * as messages from './utils/messages';

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

  async updateDependencyVersionRange(depName: string, versionRange: string) {
    for (let type of DEPENDENCY_TYPES) {
      if (!this.config[type]) {
        continue;
      }

      let config = Object.assign({}, this.config);
      let deps = Object.assign({}, this.config[type]);

      deps[depName] = versionRange;
      config[type] = deps;

      await writeConfigFile(this.filePath, config);
      this.config = config;
      logger.info(messages.updatedPackageDependency(this.config.name, depName, versionRange));
      return;
    }

    throw new Error(messages.unableToUpdateDepVersion(this.config.name, depName, versionRange));
  }

  async maybeUpdateDependencyVersionRange(depName: string, current: string, version: string) {
    let versionRange = '^' + version;
    let updated = false;

    if (semver.satisfies(version, current)) {
      await this.updateDependencyVersionRange(depName, versionRange);
      updated = true;
    }

    return updated;
  }
}
