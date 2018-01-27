// @flow
import * as options from '../../utils/options';
import * as npm from '../../utils/npm';
import { BoltError } from '../../utils/errors';

export type TeamListOptions = {
  cwd?: string,
  args: Array<string>
};

export function toTeamListOptions(
  args: options.Args,
  flags: options.Flags
): TeamListOptions {
  return { cwd: options.string(flags.cwd, 'cwd'), args };
}

export async function teamList(opts: TeamListOptions) {
  let cwd = opts.cwd || process.cwd();
  try {
    await npm.cliCommand(cwd, 'team', ['ls', ...opts.args]);
  } catch (err) {
    throw new BoltError(err);
  }
}
