// @flow
import * as yarn from '../utils/yarn';
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';

type BinOptions = {
  cwd?: string
};

function toBinOptions(args: options.Args, flags: options.Flags): BinOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd')
  };
}

export async function bin(flags: options.Flags, args: Array<string>) {
  let opts = toBinOptions(args, flags);
  let cwd = opts.cwd || process.cwd();

  try {
    await yarn.cliCommand(cwd, 'bin');
  } catch (err) {
    throw new BoltError(err);
  }
}
