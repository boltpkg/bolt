// @flow
import * as options from '../../utils/options';
import * as npm from '../../utils/npm';
import { BoltError } from '../../utils/errors';

type TeamAddOptions = {
  cwd?: string,
  args: Array<string>
};

function toTeamAddOptions(
  args: options.Args,
  flags: options.Flags
): TeamAddOptions {
  return { cwd: options.string(flags.cwd, 'cwd'), args };
}

export async function teamAdd(flags: options.Flags, args: options.Args) {
  let opts = toTeamAddOptions(args, flags);
  let cwd = opts.cwd || process.cwd();
  try {
    await npm.cliCommand(cwd, 'team', ['add', ...opts.args]);
  } catch (err) {
    throw new BoltError(err);
  }
}
