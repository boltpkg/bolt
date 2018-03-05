// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';
import { run } from './run';
import type { CommandArgsType } from '../types';

type BuildOptions = {};

function toBuildOptions(
  args: options.Args,
  flags: options.Flags
): BuildOptions {
  return {};
}

export async function build({ commandArgs, flags }: CommandArgsType) {
  return await run(flags, ['build', ...commandArgs]);
}
