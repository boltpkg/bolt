// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';
import * as yarn from '../utils/yarn';

export type InfoOptions = {|
  cwd?: string,
  args: options.Args
|};

export function toInfoOptions(
  args: options.Args,
  flags: options.Flags
): InfoOptions {
  const depsArgs = Array.prototype.concat([], args);
  Object.keys(flags).forEach(key => {
    if (flags[key] === true) {
      depsArgs.push(`--${key}`);
    }
  });
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    args: depsArgs
  };
}

export async function info(opts: InfoOptions) {
  let cwd = opts.cwd || process.cwd();
  try {
    await yarn.info(cwd, opts.args);
  } catch (err) {
    throw new BoltError(err);
  }
}
