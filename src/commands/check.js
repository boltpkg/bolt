// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';
import { run } from './run';

type CheckOptions = {|
  cwd?: string,
  args: options.Args
|};

function toCheckOptions(
  args: options.Args,
  flags: options.Flags
): CheckOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    args: args
  };
}

export async function check(flags: options.Flags, commandArgs: Array<string>) {
  let opts = toCheckOptions(commandArgs, flags);
  await run({
    cwd: opts.cwd,
    script: 'check',
    scriptArgs: opts.args
  });
}
