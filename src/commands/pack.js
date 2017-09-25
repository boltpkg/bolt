// @flow
import * as options from '../utils/options';
import { PError } from '../utils/errors';

export type PackOptions = {};

export function toPackOptions(
  args: options.Args,
  flags: options.Flags
): PackOptions {
  return {};
}

export async function pack(opts: PackOptions) {
  throw new PError('Unimplemented command "pack"');
}
