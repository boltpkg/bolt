// @flow
import * as options from '../../utils/options';
import * as yarn from '../../utils/yarn';
import { BoltError } from '../../utils/errors';

type OwnerListOptions = {
  cwd?: string,
  args: Array<string>
};

function toOwnerListOptions(
  args: options.Args,
  flags: options.Flags
): OwnerListOptions {
  return { cwd: options.string(flags.cwd, 'cwd'), args };
}

export async function ownerList(flags: options.Flags, args: options.Args) {
  let opts = toOwnerListOptions(args, flags);
  let cwd = opts.cwd || process.cwd();

  try {
    await yarn.cliCommand(cwd, 'owner', ['list', ...opts.args]);
  } catch (err) {
    throw new BoltError(err);
  }
}
