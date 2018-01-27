// @flow
import * as options from '../../utils/options';
import * as npm from '../../utils/npm';
import { BoltError } from '../../utils/errors';

export type TeamRemoveOptions = {
  cwd?: string,
  args: Array<string>
};

export function toTeamRemoveOptions(
  args: options.Args,
  flags: options.Flags
): TeamRemoveOptions {
  return { cwd: options.string(flags.cwd, 'cwd'), args };
}

export async function teamRemove(opts: TeamRemoveOptions) {
  let cwd = opts.cwd || process.cwd();
  try {
    await npm.cliCommand(cwd, 'team', ['rm', ...opts.args]);
  } catch (err) {
    throw new BoltError(err);
  }
}
