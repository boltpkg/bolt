// @flow
import Package from './Package';
import type {Config} from './types';

export default class Workspace {
  pkg: Package;

  constructor(pkg: Package) {
    this.pkg = pkg;
  }

  static async init(pkg: Package) {
    return new Workspace(pkg);
  }
}
