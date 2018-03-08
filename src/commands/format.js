// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';
import { run } from './run';

export type FormatOptions = {|
  cwd?: string,
  args: options.Args,
  scriptFlags: Array<string>
|};

export function toFormatOptions(
  args: options.Args,
  flags: options.Flags,
  scriptFlags: Array<string>
): FormatOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    args: args,
    scriptFlags
  };
}

export async function format(opts: FormatOptions) {
  await run({
    cwd: opts.cwd,
    script: 'format',
    scriptArgs: opts.args,
    scriptFlags: opts.scriptFlags
  });
}
