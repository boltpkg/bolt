// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';
import { run } from './run';

type LintOptions = {|
  cwd?: string,
  args: options.Args
|};

function toLintOptions(args: options.Args, flags: options.Flags): LintOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    args: args
  };
}

export async function lint(flags: options.Flags, commandArgs: Array<string>) {
  let opts = toLintOptions(commandArgs, flags);
  await run({
    cwd: opts.cwd,
    script: 'lint',
    scriptArgs: opts.args
  });
}
