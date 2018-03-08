// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';
import { run } from './run';

export type LintOptions = {|
  cwd?: string,
  args: options.Args,
  scriptFlags: Array<string>
|};

export function toLintOptions(
  args: options.Args,
  flags: options.Flags,
  scriptFlags: Array<string>
): LintOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    args: args,
    scriptFlags
  };
}

export async function lint(opts: LintOptions) {
  await run({
    cwd: opts.cwd,
    script: 'lint',
    scriptArgs: opts.args,
    scriptFlags: opts.scriptFlags
  });
}
