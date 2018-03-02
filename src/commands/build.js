// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';
import { run } from './run';

type BuildOptions = {|
  cwd?: string,
  args: options.Args
|};

function toBuildOptions(
  args: options.Args,
  flags: options.Flags
): BuildOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    args: args
  };
}

export async function build(flags: options.Flags, commandArgs: Array<string>) {
  let opts = toBuildOptions(commandArgs, flags);
  await run({
    cwd: opts.cwd,
    script: 'build',
    scriptArgs: opts.args
  });
}
