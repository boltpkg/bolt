// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';
import { run } from './run';
import type { CommandArgsType } from '../types';

type DocOptions = {};

function toDocOptions(args: options.Args, flags: options.Flags): DocOptions {
  return {};
}

export async function doc({ commandArgs, flags }: CommandArgsType) {
  await run(flags, ['doc', ...commandArgs]);
}
