// @flow
import * as options from '../utils/options';
import * as npm from '../utils/npm';
import { BoltError } from '../utils/errors';

export type LoginOptions = {|
  cwd?: string
|};

export function toLoginOptions(
  args: options.Args,
  flags: options.Flags
): LoginOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd')
  };
}

export async function login(opts: LoginOptions) {
  let cwd = opts.cwd || process.cwd();
  try {
    await npm.login(cwd);
  } catch (err) {
    throw new BoltError(err);
  }
}
