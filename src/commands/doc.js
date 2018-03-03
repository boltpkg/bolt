// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';
import { run } from './run';

type DocOptions = {|
  cwd?: string,
  args: options.Args
|};

function toDocOptions(args: options.Args, flags: options.Flags): DocOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    args: args
  };
}

export async function doc(flags: options.Flags, args: Array<string>) {
  let opts = toDocOptions(args, flags);
  await run({
    cwd: opts.cwd,
    script: 'doc',
    scriptArgs: opts.args
  });
}
