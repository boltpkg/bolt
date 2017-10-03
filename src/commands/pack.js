// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';

export type PackOptions = {};

export function toPackOptions(
  args: options.Args,
  flags: options.Flags
): PackOptions {
  return {};
}

export async function pack(opts: PackOptions) {
  throw new BoltError('Unimplemented command "pack"');
}
