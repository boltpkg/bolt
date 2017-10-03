// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';
import { run } from './run';

export type FormatOptions = {|
  cwd?: string,
  args: options.Args
|};

export function toFormatOptions(
  args: options.Args,
  flags: options.Flags
): FormatOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    args: args
  };
}

export async function format(opts: FormatOptions) {
  await run({
    cwd: opts.cwd,
    script: 'format',
    scriptArgs: opts.args
  });
}
