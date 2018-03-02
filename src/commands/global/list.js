// @flow
import * as options from '../../utils/options';
import * as yarn from '../../utils/yarn';
import { BoltError } from '../../utils/errors';

type GlobalListOptions = {
  cwd?: string,
  args: Array<string>
};

function toGlobalListOptions(
  args: options.Args,
  flags: options.Flags
): GlobalListOptions {
  return { cwd: options.string(flags.cwd, 'cwd'), args };
}

export async function list(flags: options.Flags, args: options.Args) {
  let opts = toGlobalListOptions(args, flags);
  let cwd = opts.cwd || process.cwd();
  try {
    await yarn.cliCommand(cwd, 'global', ['list', ...opts.args]);
  } catch (err) {
    throw new BoltError(err);
  }
}
