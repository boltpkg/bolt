// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';
import * as yarn from '../utils/yarn';

export type InfoOptions = {|
  cwd?: string,
  args: options.Args
|};

function flagsToArgs(flagArgs: options.Flags): Array<string> {
  const flagArgsKey = Object.keys(flagArgs);
  // Flags has default -- key
  if (flagArgsKey.length < 1) {
    return [];
  }
  const flag = [];
  flagArgsKey.forEach(key => {
    if (flagArgs[key] === true) {
      flag.push(`--${key}`);
    }
  });
  return flag;
}

export function toInfoOptions(
  args: options.Args,
  flags: options.Flags
): InfoOptions {
  const infoFlagArgs = flagsToArgs(flags);
  const infoSpawnArgs = Array.prototype.concat([], args, infoFlagArgs);
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    args: infoSpawnArgs
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
