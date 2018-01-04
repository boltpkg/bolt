// @flow
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';
import * as yarn from '../../utils/yarn';

export type CacheListOptions = {
  cwd?: string,
  pattern?: string
};

export function toCacheListOptions(
  args: options.Args,
  flags: options.Flags
): CacheListOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    pattern: options.string(flags.pattern, 'pattern') || ''
  };
}

export async function cacheList(opts: CacheListOptions) {
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
