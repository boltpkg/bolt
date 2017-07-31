// @flow
import readConfig from './utils/readConfig';
import {dirname} from 'path';
import type {Config} from './types';

const DEPENDENCY_TYPES = [
  'dependencies',
  'devDependencies',
  'peerDependencies',
  'bundledDependencies',
  'optionalDependencies',
];

export default class Package {
  filePath: string;
  dir: string;
  config: Config;

  constructor(filePath: string, config: Config) {
    this.filePath = filePath;
    this.dir = dirname(filePath);
    this.config = config;
  }

  static async init(filePath: string) {
    let config = await readConfig(filePath);
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
}
