// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';
import * as yarn from '../utils/yarn';
import type { CommandArgsType } from '../types';

type ImportOptions = {
  cwd?: string
};

function toImportOptions(
  args: options.Args,
  flags: options.Flags
): ImportOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd')
  };
}

export async function import_({ commandArgs, flags }: CommandArgsType) {
  let opts = toImportOptions(commandArgs, flags);
  let cwd = opts.cwd || process.cwd();

  try {
    await yarn.cliCommand(cwd, 'import');
  } catch (err) {
    throw new BoltError(err);
  }
}
