// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';

export type HelpOptions = {};

export function toHelpOptions(
  args: options.Args,
  flags: options.Flags
): HelpOptions {
  return {};
}

export async function help(opts: HelpOptions) {
  throw new BoltError('Unimplemented command "help"');
}
