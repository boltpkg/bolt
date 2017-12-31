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
  flags: options.Flags
): FormatOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    args: args,
    scriptFlags: options.toScriptFlags(flags)
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
