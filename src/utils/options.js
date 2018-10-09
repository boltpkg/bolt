// @flow
import type { Dependency, SpawnOpts, FilterOpts } from '../types';

export type Args = Array<string>;

export type Flags = {
  '--'?: Array<string>,
  [key: string]: boolean | string
};

export function string(val: mixed, name: string): string | void {
  if (typeof val !== 'undefined' && typeof val !== 'string') {
    throw new Error(`Flag "${name}" must be string`);
  } else {
    return val;
  }
}

export function boolean(val: mixed, name: string): boolean | void {
  if (typeof val !== 'undefined' && typeof val !== 'boolean') {
    throw new Error(`Flag "${name}" must be boolean`);
  } else {
    return val;
  }
}

export function number(val: mixed, name: string): number | void {
  if (typeof val !== 'undefined' && typeof val !== 'number') {
    throw new Error(`Flag "${name}" must be number`);
  } else {
    return val;
  }
}

export function toSpawnOpts(flags: Flags): SpawnOpts {
  let spawnOpts = {};

  if ((flags.parallelNodes || flags.parallel) && flags.serial) {
    throw new Error('Commands cannot be run both serially and in parallel');
  }

  if (flags.parallelNodes) spawnOpts.orderMode = 'parallel-nodes';
  if (flags.parallel) spawnOpts.orderMode = 'parallel';
  if (flags.serial) spawnOpts.orderMode = 'serial';
  if (flags.bail) spawnOpts.bail = boolean(flags.bail, 'bail');
  // TODO:
  // if (flags.concurrency) spawnOpts.maxConcurrent = number(flags.concurrency, 'concurrency');

  return spawnOpts;
}

export function toFilterOpts(flags: Flags): FilterOpts {
  let filterOpts = {};

  if (flags.only) filterOpts.only = string(flags.only, 'only');
  if (flags.onlyFs) filterOpts.onlyFs = string(flags.onlyFs, 'onlyFs');
  if (flags.ignore) filterOpts.ignore = string(flags.ignore, 'ignore');
  if (flags.ignoreFs) filterOpts.ignoreFs = string(flags.ignoreFs, 'ignoreFs');

  return filterOpts;
}

/**
 * Takes a string in one of the following forms:
 *  "pkgName", "pkgName@version", "@scope/pkgName", "@scope/pkgName@version"
 * and returns an object with the package name and version (if passed)
 */
export function toDependency(dependencyString: string): Dependency {
  let [name, version] = dependencyString.split('@').filter(part => part !== '');
  if (name.includes('/')) {
    name = '@' + name;
  }
  return version ? { name, version } : { name };
}

export function toYarnInit(flags: Flags) {
  let flagOpts = {};

  if (flags.yes || flags.y) flagOpts.yes = true;
  if (flags.private || flags.p) flagOpts.private = true;

  return flagOpts;
}
