// @flow
import * as options from '../utils/options';
import { PError } from '../utils/errors';

export type VersionOptions = {};

export function toVersionOptions(
  args: options.Args,
  flags: options.Flags
): VersionOptions {
  return {};
}

export async function version(opts: VersionOptions) {
  throw new PError('Unimplemented command "version"');
}
