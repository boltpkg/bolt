// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';

type VersionOptions = {};

function toVersionOptions(
  args: options.Args,
  flags: options.Flags
): VersionOptions {
  return {};
}

export async function version(
  flags: options.Flags,
  commandArgs: Array<string>
) {
  throw new BoltError('Unimplemented command "version"');
}
