// @flow
import * as path from 'path';
import {
  findConfigFile,
  readConfigFile,
  writeConfigFile
} from './utils/config';
import type { Config } from './types';
import { DEPENDENCY_TYPES } from './constants';
import * as processes from './utils/processes';
import * as semver from 'semver';
import * as logger from './utils/logger';
import * as messages from './utils/messages';
import sortObject from 'sort-object';
import { PError } from './utils/errors';

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
      throw new PError(`Could not find package.json in ${filePath}`);
    }
    return new Package(filePath, config);
  }

  static async closest(filePath: string) {
    let pkgPath = await findConfigFile(filePath);
    if (!pkgPath) {
      throw new PError(`Could not find package.json from "${filePath}"`);
    }
    return await Package.init(pkgPath);
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

  async setDependencyVersionRange(
    depName: string,
    depType: string,
    versionRange: string | null
  ) {
    let prevDeps = this.config[depType];
    let prevVersionRange = (prevDeps && prevDeps[depName]) || null;
    if (prevVersionRange === versionRange) return;

    await this._updateDependencies(depType, {
      ...prevDeps,
      [depName]: versionRange
    });

    let pkgName = this.config.name;

    if (versionRange === null) {
      logger.info(messages.removedPackageDependency(pkgName, depName));
    } else if (prevVersionRange === null) {
      logger.info(
        messages.addedPackageDependency(pkgName, depName, versionRange)
      );
    } else {
      logger.info(
        messages.updatedPackageDependency(
          pkgName,
          depName,
          versionRange,
          prevVersionRange
        )
      );
    }
  }

  async _updateDependencies(
    depType: string,
    dependencies: { [key: string]: string | null }
  ) {
    let cleaned = {};

    for (let depName of Object.keys(dependencies)) {
      let versionRange = dependencies[depName];

      if (typeof versionRange === 'string') {
        cleaned[depName] = versionRange;
      }
    }

    let newConfig = {
      ...this.config,
      [depType]: sortObject(cleaned)
    };

    await writeConfigFile(this.filePath, newConfig);
    this.config = newConfig;
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

  isSamePackage(pkg: Package) {
    return pkg.dir === this.dir;
  }
}
