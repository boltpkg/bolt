// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';
import * as yarn from '../utils/yarn';

type CreateOptions = {
  cwd?: string,
  args?: Array<string>
};

function toCreateOptions(
  args: options.Args,
  flags: options.Flags
): CreateOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    args
  };
}

export async function create(flags: options.Flags, commandArgs: Array<string>) {
  let opts = toCreateOptions(commandArgs, flags);
  let cwd = opts.cwd || process.cwd();

  try {
    await yarn.cliCommand(cwd, 'create', opts.args);
  } catch (err) {
    throw new BoltError(err);
  }
}
