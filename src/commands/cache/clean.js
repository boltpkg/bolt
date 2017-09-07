// @flow
import * as options from '../../utils/options';
import {PError} from '../../utils/errors';

export type CacheCleanOptions = {};

export function toCacheCleanOptions(args: options.Args, flags: options.Flags): CacheCleanOptions {
  return {};
}

export async function cacheClean(opts: CacheCleanOptions) {
  throw new PError('Unimplemented command "cache clean"');
}
