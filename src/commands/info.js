// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';
import * as yarn from '../utils/yarn';

type InfoOptions = {|
  cwd?: string,
  args: options.Args,
  flags: options.Flags
|};

function toInfoOptions(args: options.Args, flags: options.Flags): InfoOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    args,
    flags
  };
}

export async function info(flags: options.Flags, commandArgs: Array<string>) {
  let opts = toInfoOptions(commandArgs, flags);
  let cwd = opts.cwd || process.cwd();
  const spawnArgs = Array.prototype.concat([], opts.args);
  if (opts.flags && opts.flags.json) {
    spawnArgs.push('--json');
  }
  try {
    await yarn.info(cwd, spawnArgs);
  } catch (err) {
    throw new BoltError(err);
  }
}
