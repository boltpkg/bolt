// @flow
import * as options from '../utils/options';
import { PError } from '../utils/errors';

export type LogoutOptions = {};

export function toLogoutOptions(
  args: options.Args,
  flags: options.Flags
): LogoutOptions {
  return {};
}

export async function logout(opts: LogoutOptions) {
  throw new PError('Unimplemented command "logout"');
}
