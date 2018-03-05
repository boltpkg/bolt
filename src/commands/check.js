// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';
import { run } from './run';
import type { CommandArgsType } from '../types';

type CheckOptions = {};

function toCheckOptions(
  args: options.Args,
  flags: options.Flags
): CheckOptions {
  return {};
}

export async function check({ commandArgs, flags }: CommandArgsType) {
  return await run(flags, ['check', ...commandArgs]);
}
