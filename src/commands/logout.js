// @flow
import * as options from '../utils/options';
import * as npm from '../utils/npm';
import { BoltError } from '../utils/errors';

type LogoutOptions = {|
  cwd?: string
|};

function toLogoutOptions(
  args: options.Args,
  flags: options.Flags
): LogoutOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd')
  };
}

export async function logout(flags: options.Flags, args: Array<string>) {
  let opts = toLogoutOptions(args, flags);
  let cwd = opts.cwd || process.cwd();
  try {
    await npm.logout(cwd);
  } catch (err) {
    throw new BoltError(err);
  }
}
