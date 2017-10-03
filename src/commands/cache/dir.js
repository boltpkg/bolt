// @flow
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';

export type CacheDirOptions = {};

export function toCacheDirOptions(
  args: options.Args,
  flags: options.Flags
): CacheDirOptions {
  return {};
}

export async function cacheDir(opts: CacheDirOptions) {
  throw new BoltError('Unimplemented command "cache dir"');
}
