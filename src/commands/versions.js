// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';
import type { CommandArgsType } from '../types';

type VersionsOptions = {};

function toVersionsOptions(
  args: options.Args,
  flags: options.Flags
): VersionsOptions {
  return {};
}

export async function versions({ commandArgs, flags }: CommandArgsType) {
  throw new BoltError('Unimplemented command "versions"');
}
