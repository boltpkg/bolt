// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';

type VersionsOptions = {};

function toVersionsOptions(
  args: options.Args,
  flags: options.Flags
): VersionsOptions {
  return {};
}

export async function versions(flags: options.Flags, args: Array<string>) {
  throw new BoltError('Unimplemented command "versions"');
}
