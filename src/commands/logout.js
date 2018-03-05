// @flow
import * as options from '../utils/options';
import * as npm from '../utils/npm';
import { BoltError } from '../utils/errors';
import type { CommandArgsType } from '../types';

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

export async function logout({ commandArgs, flags }: CommandArgsType) {
  let opts = toLogoutOptions(commandArgs, flags);
  let cwd = opts.cwd || process.cwd();
  try {
    await npm.logout(cwd);
  } catch (err) {
    throw new BoltError(err);
  }
}
