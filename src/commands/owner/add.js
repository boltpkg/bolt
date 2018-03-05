// @flow
import * as options from '../../utils/options';
import * as yarn from '../../utils/yarn';
import { BoltError } from '../../utils/errors';
import type { SubCommandArgsType } from '../../types';

type OwnerAddOptions = {
  cwd?: string,
  args: Array<string>
};

function toOwnerAddOptions(
  args: options.Args,
  flags: options.Flags
): OwnerAddOptions {
  return { cwd: options.string(flags.cwd, 'cwd'), args };
}

export async function ownerAdd({ flags, subCommandArgs }: SubCommandArgsType) {
  let opts = toOwnerAddOptions(subCommandArgs, flags);
  let cwd = opts.cwd || process.cwd();
  try {
    await yarn.cliCommand(cwd, 'owner', ['add', ...opts.args]);
  } catch (err) {
    throw new BoltError(err);
  }
}
