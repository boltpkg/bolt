// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';
import { run } from './run';

export type TestOptions = {|
  cwd?: string,
  args: options.Args,
  scriptFlags: Array<string>
|};

export function toTestOptions(
  args: options.Args,
  flags: options.Flags,
  scriptFlags: Array<string>
): TestOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    args: args,
    scriptFlags
  };
}

export async function test(opts: TestOptions) {
  await run({
    cwd: opts.cwd,
    script: 'test',
    scriptArgs: opts.args,
    scriptFlags: opts.scriptFlags
  });
}
