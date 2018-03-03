// @flow
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';
import * as yarn from '../../utils/yarn';

type CacheListOptions = {
  cwd?: string,
  pattern?: string
};

function toCacheListOptions(
  args: options.Args,
  flags: options.Flags
): CacheListOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    pattern: options.string(flags.pattern, 'pattern') || ''
  };
}

export async function cacheList(
  flags: options.Flags,
  commandArgs: options.Args
) {
  let opts = toCacheListOptions(commandArgs, flags);
  let cwd = opts.cwd || process.cwd();
  let args = ['list'];
  if (opts.pattern) {
    args = args.concat([`--pattern=${opts.pattern}`]);
  }

  try {
    await yarn.cliCommand(cwd, 'cache', args);
  } catch (err) {
    throw new BoltError(err);
  }
}
