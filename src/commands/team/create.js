// @flow
import * as options from '../../utils/options';
import * as npm from '../../utils/npm';
import { BoltError } from '../../utils/errors';

export type TeamCreateOptions = {
  cwd?: string,
  args: Array<string>
};

export function toTeamCreateOptions(
  args: options.Args,
  flags: options.Flags
): TeamCreateOptions {
  return { cwd: options.string(flags.cwd, 'cwd'), args };
}

export async function teamCreate(opts: TeamCreateOptions) {
  let cwd = opts.cwd || process.cwd();
  try {
    await npm.cliCommand(cwd, 'team', ['create', ...opts.args]);
  } catch (err) {
    throw new BoltError(err);
  }
}
