// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';
import * as yarn from '../utils/yarn';
import type { CommandArgsType } from '../types';

type OutdatedOptions = {
  cwd?: string,
  args?: Array<string>
};

function toOutdatedOptions(
  args: options.Args,
  flags: options.Flags
): OutdatedOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    args
  };
}

export async function outdated({ commandArgs, flags }: CommandArgsType) {
  let opts = toOutdatedOptions(commandArgs, flags);
  let cwd = opts.cwd || process.cwd();
  try {
    await yarn.cliCommand(cwd, 'outdated', opts.args);
  } catch (err) {
    throw new BoltError(err);
  }
}
