// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';

export type AddOptions = {};

export function toAddOptions(
  args: options.Args,
  flags: options.Flags
): AddOptions {
  return {};
}

export async function add(opts: AddOptions) {
  throw new BoltError('Unimplemented command "add"');
}
