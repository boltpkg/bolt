// @flow
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';
import * as yarn from '../../utils/yarn';

export type CacheCleanOptions = {
  cwd?: string,
  args: Array<string>
};

export function toCacheCleanOptions(
  args: options.Args,
  flags: options.Flags
): CacheCleanOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    args: args || []
  };
}

export async function cacheClean(opts: CacheCleanOptions) {
  let cwd = opts.cwd || process.cwd();
  let args = ['clean'];

  if (opts.args.length) {
    args = args.concat(opts.args);
  }
  try {
    await yarn.cliCommand(cwd, 'cache', args);
  } catch (err) {
    throw new BoltError(err);
  }
}
