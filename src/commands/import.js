// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';
import * as yarn from '../utils/yarn';

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

export async function import_(
  flags: options.Flags,
  commandArgs: Array<string>
) {
  let opts = toImportOptions(commandArgs, flags);
  let cwd = opts.cwd || process.cwd();

  try {
    await yarn.cliCommand(cwd, 'import');
  } catch (err) {
    throw new BoltError(err);
  }
}
