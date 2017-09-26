// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';
import { run } from './run';

export type DocOptions = {|
  cwd?: string,
  args: options.Args
|};

export function toDocOptions(
  args: options.Args,
  flags: options.Flags
): DocOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    args: args
  };
}

export async function doc(opts: DocOptions) {
  await run({
    cwd: opts.cwd,
    script: 'doc',
    scriptArgs: opts.args
  });
}
