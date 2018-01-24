// @flow
import * as options from '../utils/options';
import * as npm from '../utils/npm';
import { BoltError } from '../utils/errors';

export type LogoutOptions = {|
  cwd?: string
|};

export function toLogoutOptions(
  args: options.Args,
  flags: options.Flags
): LogoutOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd')
  };
}

export async function logout(opts: LogoutOptions) {
  let cwd = opts.cwd || process.cwd();
  try {
    await npm.logout(cwd);
  } catch (err) {
    throw new BoltError(err);
  }
}
