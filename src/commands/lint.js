// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';
import { run } from './run';
import type { CommandArgsType } from '../types';

type LintOptions = {};

function toLintOptions(args: options.Args, flags: options.Flags): LintOptions {
  return {};
}

export async function lint({ commandArgs, flags }: CommandArgsType) {
  return await run(flags, ['lint', ...commandArgs]);
}
