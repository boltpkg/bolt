// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';
import { run } from './run';

type FormatOptions = {|
  cwd?: string,
  args: options.Args
|};

function toFormatOptions(
  args: options.Args,
  flags: options.Flags
): FormatOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    args: args
  };
}

export async function format(flags: options.Flags, commandArgs: Array<string>) {
  let opts = toFormatOptions(commandArgs, flags);
  await run({
    cwd: opts.cwd,
    script: 'format',
    scriptArgs: opts.args
  });
}
