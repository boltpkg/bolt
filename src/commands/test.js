// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';
import { run } from './run';
import type { CommandArgsType } from '../types';

type TestOptions = {};

function toTestOptions(args: options.Args, flags: options.Flags): TestOptions {
  return {};
}

export async function test({ commandArgs, flags }: CommandArgsType) {
  return await run(flags, ['test', ...commandArgs]);
}
