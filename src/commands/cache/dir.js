// @flow
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';
import * as yarn from '../../utils/yarn';

export type CacheDirOptions = {
  cwd?: string
};

export function toCacheDirOptions(
  args: options.Args,
  flags: options.Flags
): CacheDirOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd')
  };
}

export async function cacheDir(opts: CacheDirOptions) {
  let cwd = opts.cwd || process.cwd();

  try {
    await yarn.cliCommand(cwd, 'cache', ['dir']);
  } catch (err) {
    throw new BoltError(err);
  }
}
