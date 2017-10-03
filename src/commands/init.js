// @flow
import * as options from '../utils/options';
import * as yarn from '../utils/yarn';

export type InitOptions = {|
  cwd?: string
|};

export function toInitOptions(
  args: options.Args,
  flags: options.Flags
): InitOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd')
  };
}

export async function init(opts: InitOptions) {
  let cwd = opts.cwd || process.cwd();

  await yarn.init(cwd);
}
