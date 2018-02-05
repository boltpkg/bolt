// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';
import { run } from './run';

export type DocOptions = {|
  cwd?: string,
  args: options.Args,
  scriptFlags: Array<string>
|};

export function toDocOptions(
  args: options.Args,
  flags: options.Flags,
  scriptFlags: Array<string>
): DocOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    args: args,
    scriptFlags
  };
}

export async function doc(opts: DocOptions) {
  await run({
    cwd: opts.cwd,
    script: 'doc',
    scriptArgs: opts.args,
    scriptFlags: opts.scriptFlags
  });
}
