// @flow
import * as options from '../utils/options';
import { PError } from '../utils/errors';

export type LoginOptions = {};

export function toLoginOptions(
  args: options.Args,
  flags: options.Flags
): LoginOptions {
  return {};
}

export async function login(opts: LoginOptions) {
  throw new PError('Unimplemented command "login"');
}
