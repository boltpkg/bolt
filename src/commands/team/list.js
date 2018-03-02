// @flow
import * as options from '../../utils/options';
import * as npm from '../../utils/npm';
import { BoltError } from '../../utils/errors';

type TeamListOptions = {
  cwd?: string,
  args: Array<string>
};

function toTeamListOptions(
  args: options.Args,
  flags: options.Flags
): TeamListOptions {
  return { cwd: options.string(flags.cwd, 'cwd'), args };
}

export async function list(flags: options.Flags, args: options.Args) {
  let opts = toTeamListOptions(args, flags);
  let cwd = opts.cwd || process.cwd();
  try {
    await npm.cliCommand(cwd, 'team', ['ls', ...opts.args]);
  } catch (err) {
    throw new BoltError(err);
  }
}
