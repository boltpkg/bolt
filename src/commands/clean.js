// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';

export type CleanOptions = {};

export function toCleanOptions(
  args: options.Args,
  flags: options.Flags
): CleanOptions {
  return {};
}

export async function clean(opts: CleanOptions) {
  throw new BoltError('Unimplemented command "clean"');
}
