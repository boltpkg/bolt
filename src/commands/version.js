// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';
import type { CommandArgsType } from '../types';

type VersionOptions = {};

function toVersionOptions(
  args: options.Args,
  flags: options.Flags
): VersionOptions {
  return {};
}

export async function version({ commandArgs, flags }: CommandArgsType) {
  throw new BoltError('Unimplemented command "version"');
}
