// @flow
import * as options from '../../utils/options';
import * as yarn from '../../utils/yarn';
import { BoltError } from '../../utils/errors';

export type OwnerListOptions = {
  cwd?: string,
  args: Array<string>
};

export function toOwnerListOptions(
  args: options.Args,
  flags: options.Flags
): OwnerListOptions {
  return { cwd: options.string(flags.cwd, 'cwd'), args };
}

export async function ownerList(opts: OwnerListOptions) {
  let cwd = opts.cwd || process.cwd();
  let args = opts.args || [];

  try {
    await yarn.cliCommand(cwd, 'owner', ['list', ...args]);
  } catch (err) {
    throw new BoltError(err);
  }
}
