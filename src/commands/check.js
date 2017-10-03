// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';
import { run } from './run';

export type CheckOptions = {|
  cwd?: string,
  args: options.Args
|};

export function toCheckOptions(
  args: options.Args,
  flags: options.Flags
): CheckOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    args: args
  };
}

export async function check(opts: CheckOptions) {
  await run({
    cwd: opts.cwd,
    script: 'check',
    scriptArgs: opts.args
  });
}
