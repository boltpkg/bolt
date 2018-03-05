// @flow
import * as options from '../../utils/options';
import * as npm from '../../utils/npm';
import { BoltError } from '../../utils/errors';
import type { SubCommandArgsType } from '../../types';

type TeamCreateOptions = {
  cwd?: string,
  args: Array<string>
};

function toTeamCreateOptions(
  args: options.Args,
  flags: options.Flags
): TeamCreateOptions {
  return { cwd: options.string(flags.cwd, 'cwd'), args };
}

export async function teamCreate({
  flags,
  subCommandArgs
}: SubCommandArgsType) {
  let opts = toTeamCreateOptions(subCommandArgs, flags);
  let cwd = opts.cwd || process.cwd();
  try {
    await npm.cliCommand(cwd, 'team', ['create', ...opts.args]);
  } catch (err) {
    throw new BoltError(err);
  }
}
