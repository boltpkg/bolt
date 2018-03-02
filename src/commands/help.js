// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';

type HelpOptions = {};

function toHelpOptions(args: options.Args, flags: options.Flags): HelpOptions {
  return {};
}

export async function help(flags: options.Flags, commandArgs: Array<string>) {
  throw new BoltError('Unimplemented command "help"');
}
