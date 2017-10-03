// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';

export type VersionsOptions = {};

export function toVersionsOptions(
  args: options.Args,
  flags: options.Flags
): VersionsOptions {
  return {};
}

export async function versions(opts: VersionsOptions) {
  throw new BoltError('Unimplemented command "versions"');
}
