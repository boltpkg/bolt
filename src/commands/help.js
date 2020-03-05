// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';
import * as messages from '../utils/messages';

export type HelpOptions = {
  command?: string
};

export function toHelpOptions(
  args: options.Args,
  flags: options.Flags
): HelpOptions {
  return {
    command: args.length > 0 ? args[0] : undefined
  };
}

export async function help(opts: HelpOptions) {
  if (opts.command) {
    throw new BoltError('Subcommand help information is not available yet.');
  } else {
    console.log(messages.helpContent());
  }
}
