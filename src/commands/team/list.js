// @flow
import * as options from '../../utils/options';
import * as npm from '../../utils/npm';
import { BoltError } from '../../utils/errors';
import type { SubCommandArgsType } from '../../types';

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

export async function teamList({ flags, subCommandArgs }: SubCommandArgsType) {
  let opts = toTeamListOptions(subCommandArgs, flags);
  let cwd = opts.cwd || process.cwd();
  try {
    await npm.cliCommand(cwd, 'team', ['ls', ...opts.args]);
  } catch (err) {
    throw new BoltError(err);
  }
}
