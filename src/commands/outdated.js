// @flow
import * as options from '../utils/options';
import { PError } from '../utils/errors';

export type OutdatedOptions = {};

export function toOutdatedOptions(
  args: options.Args,
  flags: options.Flags
): OutdatedOptions {
  return {};
}

export async function outdated(opts: OutdatedOptions) {
  throw new PError('Unimplemented command "outdated"');
}
