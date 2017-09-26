// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';
import { run } from './run';

export type BuildOptions = {|
  cwd?: string,
  args: options.Args
|};

export function toBuildOptions(
  args: options.Args,
  flags: options.Flags
): BuildOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    args: args
  };
}

export async function build(opts: BuildOptions) {
  await run({
    cwd: opts.cwd,
    script: 'build',
    scriptArgs: opts.args
  });
}
