// @flow
import * as options from '../utils/options';
import { PError } from '../utils/errors';
import { run } from './run';

export type TestOptions = {|
  cwd?: string,
  args: options.Args
|};

export function toTestOptions(
  args: options.Args,
  flags: options.Flags
): TestOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    args: args
  };
}

export async function test(opts: TestOptions) {
  await run({
    cwd: opts.cwd,
    script: 'test',
    scriptArgs: opts.args
  });
}
