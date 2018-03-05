// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';
import { run } from './run';
import type { CommandArgsType } from '../types';

type FormatOptions = {};

function toFormatOptions(
  args: options.Args,
  flags: options.Flags
): FormatOptions {
  return {};
}

export async function format({ commandArgs, flags }: CommandArgsType) {
  return await run(flags, ['format', ...commandArgs]);
}
