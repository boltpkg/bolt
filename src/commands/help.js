// @flow
import * as options from '../utils/options';
import {PError} from '../utils/errors';

export type HelpOptions = {};

export function toHelpOptions(args: options.Args, flags: options.Flags): HelpOptions {
  return {};
}

export async function help(opts: HelpOptions) {
  throw new PError('Unimplemented command "help"');
}
