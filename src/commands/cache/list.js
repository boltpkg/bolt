// @flow
import * as options from '../../utils/options';
import * as yarn from '../../utils/yarn';

export type CacheListOptions = {
  cwd?: string
};

export function toCacheListOptions(
  args: options.Args,
  flags: options.Flags
): CacheListOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd')
  };
}

export async function cacheList(opts: CacheListOptions) {
  let cwd = opts.cwd || process.cwd();

  await yarn.cache(cwd, 'list');
}
