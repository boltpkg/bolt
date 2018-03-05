// @flow
import * as yarn from '../utils/yarn';
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';
import type { CommandArgsType } from '../types';

type BinOptions = {
  cwd?: string
};

function toBinOptions(args: options.Args, flags: options.Flags): BinOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd')
  };
}

export async function bin({ commandArgs, flags }: CommandArgsType) {
  let opts = toBinOptions(commandArgs, flags);
  let cwd = opts.cwd || process.cwd();

  try {
    await yarn.cliCommand(cwd, 'bin');
  } catch (err) {
    throw new BoltError(err);
  }
}
