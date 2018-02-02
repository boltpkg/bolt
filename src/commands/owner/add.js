// @flow
import * as options from '../../utils/options';
import * as yarn from '../../utils/yarn';
import { BoltError } from '../../utils/errors';

export type OwnerAddOptions = {
  cwd?: string,
  args: Array<string>
};

export function toOwnerAddOptions(
  args: options.Args,
  flags: options.Flags
): OwnerAddOptions {
  return { cwd: options.string(flags.cwd, 'cwd'), args };
}

export async function ownerAdd(opts: OwnerAddOptions) {
  let cwd = opts.cwd || process.cwd();
  try {
    await yarn.cliCommand(cwd, 'owner', ['add', ...opts.args]);
  } catch (err) {
    throw new BoltError(err);
  }
}
