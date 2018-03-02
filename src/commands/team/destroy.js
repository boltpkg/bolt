// @flow
import * as options from '../../utils/options';
import * as npm from '../../utils/npm';
import { BoltError } from '../../utils/errors';

type TeamDestroyOptions = {
  cwd?: string,
  args: Array<string>
};

function toTeamDestroyOptions(
  args: options.Args,
  flags: options.Flags
): TeamDestroyOptions {
  return { cwd: options.string(flags.cwd, 'cwd'), args };
}

export async function destroy(flags: options.Flags, args: options.Args) {
  let opts = toTeamDestroyOptions(args, flags);
  let cwd = opts.cwd || process.cwd();
  try {
    await npm.cliCommand(cwd, 'team', ['destroy', ...opts.args]);
  } catch (err) {
    throw new BoltError(err);
  }
}
