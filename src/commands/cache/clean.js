// @flow
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';

export type CacheCleanOptions = {};

export function toCacheCleanOptions(
  args: options.Args,
  flags: options.Flags
): CacheCleanOptions {
  return {};
}

export async function cacheClean(opts: CacheCleanOptions) {
  throw new BoltError('Unimplemented command "cache clean"');
}
