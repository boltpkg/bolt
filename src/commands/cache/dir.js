// @flow
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';
import * as yarn from '../../utils/yarn';
import type { SubCommandArgsType } from '../../types';

type CacheDirOptions = {
  cwd?: string
};

function toCacheDirOptions(
  args: options.Args,
  flags: options.Flags
): CacheDirOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd')
  };
}

export async function cacheDir({ flags, subCommandArgs }: SubCommandArgsType) {
  let opts = toCacheDirOptions(subCommandArgs, flags);
  let cwd = opts.cwd || process.cwd();

  try {
    await yarn.cliCommand(cwd, 'cache', ['dir']);
  } catch (err) {
    throw new BoltError(err);
  }
}
