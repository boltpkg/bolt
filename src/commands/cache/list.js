// @flow
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';

export type CacheListOptions = {};

export function toCacheListOptions(
  args: options.Args,
  flags: options.Flags
): CacheListOptions {
  return {};
}

export async function cacheList(opts: CacheListOptions) {
  throw new BoltError('Unimplemented command "cache list"');
}
