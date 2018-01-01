// @flow
import * as options from '../../utils/options';
import * as yarn from '../../utils/yarn';

export type CacheCleanOptions = {
  cwd?: string,
  subCommandArg?: string
};

export function toCacheCleanOptions(
  args: options.Args,
  flags: options.Flags
): CacheCleanOptions {
  const [subCommandArg] = args;
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    subCommandArg
  };
}

export async function cacheClean(opts: CacheCleanOptions) {
  let cwd = opts.cwd || process.cwd();
  let subCommandArgs = opts.subCommandArg || '';
  await yarn.cache(cwd, 'clean', subCommandArgs);
}
