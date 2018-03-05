// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';
import type { CommandArgsType } from '../types';

type GenerateOptions = {};

function toGenerateOptions(
  args: options.Args,
  flags: options.Flags
): GenerateOptions {
  return {};
}

export async function generate({ commandArgs, flags }: CommandArgsType) {
  throw new BoltError('Unimplemented command "generate"');
}
