// @flow
import * as options from '../../utils/options';
import * as npm from '../../utils/npm';
import { BoltError } from '../../utils/errors';

export type TeamAddOptions = {
  cwd?: string,
  args: Array<string>
};

export function toTeamAddOptions(
  args: options.Args,
  flags: options.Flags
): TeamAddOptions {
  return { cwd: options.string(flags.cwd, 'cwd'), args };
}

export async function teamAdd(opts: TeamAddOptions) {
  let cwd = opts.cwd || process.cwd();
  try {
    await npm.cliCommand(cwd, 'team', ['add', ...opts.args]);
  } catch (err) {
    throw new BoltError(err);
  }
}
