// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';

export type VersionOptions = {};

export function toVersionOptions(
  args: options.Args,
  flags: options.Flags
): VersionOptions {
  return {};
}

export async function version(opts: VersionOptions) {
  throw new BoltError('Unimplemented command "version"');
}
