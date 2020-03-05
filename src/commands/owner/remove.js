// @flow
import * as options from '../../utils/options';
import * as yarn from '../../utils/yarn';
import { BoltError } from '../../utils/errors';

export type OwnerRemoveOptions = {
  cwd?: string,
  args: Array<string>
};

export function toOwnerRemoveOptions(
  args: options.Args,
  flags: options.Flags
): OwnerRemoveOptions {
  return { cwd: options.string(flags.cwd, 'cwd'), args };
}

export async function ownerRemove(opts: OwnerRemoveOptions) {
  let cwd = opts.cwd || process.cwd();
  try {
    await yarn.cliCommand(cwd, 'owner', ['remove', ...opts.args]);
  } catch (err) {
    throw new BoltError(err);
  }
}
