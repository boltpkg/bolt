// @flow
import * as path from 'path';
import {readConfigFile, writeConfigFile} from './utils/config';
import type {Config} from './types';
import {DEPENDENCY_TYPES} from './constants';
import * as processes from './utils/processes';
import * as semver from 'semver';
import * as logger from './utils/logger';
import * as messages from './utils/messages';
import sortObject from 'sort-object';

export default class Package {
  filePath: string;
  dir: string;
  nodeModules: string;
  nodeModulesBin: string;
  contents: string;
  config: Config;
  indent: string;

  constructor(filePath: string, config: Config) {
    this.filePath = filePath;
    this.dir = path.dirname(filePath);
    this.nodeModules = path.join(this.dir, 'node_modules');
    this.nodeModulesBin = path.join(this.nodeModules, '.bin');
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

  async updateDependencyVersionRange(depName: string, depType: string, versionRange: string) {
    let prevVersionRange = this.config[depType] && this.config[depType][depName];
    if (prevVersionRange === versionRange) return;

    let newConfig = {
      ...this.config,
      [depType]: sortObject({
        ...this.config[depType],
        [depName]: versionRange,
      }),
    };

    await writeConfigFile(this.filePath, newConfig);
    this.config = newConfig;
    logger.info(messages.updatedPackageDependency(this.config.name, depName, versionRange, prevVersionRange));
  }

  getDependencyType(depName: string) {
    for (let depType of DEPENDENCY_TYPES) {
      if (this.config[depType] && this.config[depType][depName]) {
        return depType;
      }
    }
    return null;
  }

  // async maybeUpdateDependencyVersionRange(depName: string, current: string, version: string) {
  //   let versionRange = '^' + version;
  //   let updated = false;

  //   if (semver.satisfies(version, current)) {
  //     await this.updateDependencyVersionRange(depName, versionRange);
  //     updated = true;
  //   }

  //   return updated;
  // }
}
