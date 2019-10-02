// @flow
import * as path from 'path';
import Config from './Config';
import { DEPENDENCY_TYPES } from './constants';
import * as processes from './utils/processes';
import * as semver from 'semver';
import * as logger from './utils/logger';
import * as messages from './utils/messages';
import sortObject from 'sort-object';
import { BoltError } from './utils/errors';
import type { configDependencyType } from './types';

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
    let config = await Config.init(filePath);
    if (!config) {
      throw new BoltError(`Could not init config for "${filePath}"`);
    }
    return new Package(filePath, config);
  }

  static async closest(filePath: string) {
    let pkgPath = await Config.findConfigFile(filePath);
    if (!pkgPath) {
      throw new BoltError(`Could not find package.json from "${filePath}"`);
    }
    return await Package.init(pkgPath);
  }

  getWorkspacesConfig(): Array<string> {
    return this.config.getWorkspaces() || [];
  }

  getAllDependencies(excludedTypes?: configDependencyType[] = []) {
    let allDependencies = new Map();
    if (excludedTypes.length > 0) {
      let invalidTypes = excludedTypes.filter(
        t => DEPENDENCY_TYPES.indexOf(t) === -1
      );
      if (invalidTypes.length > 0) {
        throw new BoltError(
          `Invalid dependency types to exclude: "${invalidTypes.join(',')}"`
        );
      }
    }
    let dependencyTypes = DEPENDENCY_TYPES.filter(
      t => excludedTypes.indexOf(t) === -1
    );

    for (let type of dependencyTypes) {
      let deps = this.config.getDeps(type);
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
    let prevDeps = this.config.getDeps(depType);
    let prevVersionRange = (prevDeps && prevDeps[depName]) || null;
    if (prevVersionRange === versionRange) return;

    await this._updateDependencies(depType, {
      ...prevDeps,
      [depName]: versionRange
    });

    let pkgName = this.config.getDescriptor();

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
    await this.config.write({
      ...this.config.getConfig(),
      [depType]: sortObject(cleaned)
    });
  }

  getDependencyTypes(depName: string): Array<string> {
    let matchedTypes = [];
    for (let depType of DEPENDENCY_TYPES) {
      let deps = this.config.getDeps(depType);
      if (deps && deps[depName]) {
        matchedTypes.push(depType);
      }
    }
    return matchedTypes;
  }

  getDependencyVersionRange(depName: string) {
    for (let depType of DEPENDENCY_TYPES) {
      let deps = this.config.getDeps(depType);
      if (deps && deps[depName]) {
        return deps[depName];
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

  getName() {
    return this.config.getName();
  }

  getVersion() {
    return this.config.getVersion();
  }

  getBins(): Array<{ name: string, filePath: string }> {
    let bin = this.config.getBin();
    if (typeof bin === 'undefined') {
      return [];
    } else if (typeof bin === 'string') {
      return [
        {
          name: this.config.getName(),
          filePath: path.join(this.dir, bin)
        }
      ];
    } else {
      return Object.keys(bin).map(key => {
        return {
          name: key,
          filePath: path.join(this.dir, bin[key])
        };
      });
    }
  }
}
