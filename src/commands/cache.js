// @flow
import * as options from '../utils/options';
import {PError} from '../utils/errors';

import {toCacheCleanOptions, cacheClean} from './cache/clean';
import {toCacheDirOptions, cacheDir} from './cache/dir';
import {toCacheListOptions, cacheList} from './cache/list';

export type CacheOptions = {
  command: string,
  commandArgs: options.Args,
  commandFlags: options.Flags
};

export function toCacheOptions(args: options.Args, flags: options.Flags): CacheOptions {
  let [command, ...commandArgs] = args;
  return {
    command,
    commandArgs,
    commandFlags: flags,
  };
}

export async function cache(opts: CacheOptions) {
  if (opts.command === 'clean') {
    await cacheClean(toCacheCleanOptions(opts.commandArgs, opts.commandFlags));
  } else if (opts.command === 'dir') {
    await cacheDir(toCacheDirOptions(opts.commandArgs, opts.commandFlags));
  } else if (opts.command === 'list' || opts.command === 'ls' || typeof opts.command === 'undefined') {
    await cacheList(toCacheListOptions(opts.commandArgs, opts.commandFlags));
  } else {
    throw new PError(`You must specify a valid command to run in "pyarn cache"`);
  }
}
