// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';
import type { CommandArgsType } from '../types';

type HelpOptions = {};

function toHelpOptions(args: options.Args, flags: options.Flags): HelpOptions {
  return {};
}

export async function help({ commandArgs, flags }: CommandArgsType) {
  throw new BoltError('Unimplemented command "help"');
}
