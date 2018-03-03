// @flow
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';
import * as yarn from '../../utils/yarn';

type CacheCleanOptions = {
  cwd?: string,
  args: Array<string>
};

function toCacheCleanOptions(
  args: options.Args,
  flags: options.Flags
): CacheCleanOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    args: args || []
  };
}

export async function cacheClean(flags: options.Flags, args: options.Args) {
  let opts = toCacheCleanOptions(args, flags);
  let cwd = opts.cwd || process.cwd();

  try {
    await yarn.cliCommand(cwd, 'cache', ['clean', ...opts.args]);
  } catch (err) {
    throw new BoltError(err);
  }
}
