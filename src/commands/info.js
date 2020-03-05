// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';
import * as yarn from '../utils/yarn';

export type InfoOptions = {|
  cwd?: string,
  args: options.Args,
  flags: options.Flags
|};

export function toInfoOptions(
  args: options.Args,
  flags: options.Flags
): InfoOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    args,
    flags
  };
}

export async function info(opts: InfoOptions) {
  let cwd = opts.cwd || process.cwd();
  let spawnArgs = Array.prototype.concat([], opts.args);
  if (opts.flags && opts.flags.json) {
    spawnArgs.push('--json');
  }
  try {
    await yarn.info(cwd, spawnArgs);
  } catch (err) {
    throw new BoltError(err);
  }
}
