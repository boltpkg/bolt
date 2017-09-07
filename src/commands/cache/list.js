// @flow
import * as options from '../../utils/options';
import {PError} from '../../utils/errors';

export type CacheListOptions = {};

export function toCacheListOptions(args: options.Args, flags: options.Flags): CacheListOptions {
  return {};
}

export async function cacheList(opts: CacheListOptions) {
  throw new PError('Unimplemented command "cache list"');
}
