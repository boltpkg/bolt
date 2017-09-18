// @flow
import Package from '../Package';
import * as options from '../utils/options';
import * as config from '../utils/config';
import * as yarn from '../utils/yarn';
import { PError } from '../utils/errors';

export type RunOptions = {|
  cwd?: string,
  script: string,
  scriptArgs: options.Args,
|};

export function toRunOptions(args: options.Args, flags: options.Flags): RunOptions {
  let [script, ...scriptArgs] = args;
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    script,
    scriptArgs,
  };
}

export async function run(opts: RunOptions) {
  let cwd = opts.cwd || process.cwd();
  let pkgPath = await config.findConfigFile(cwd);

  if (!pkgPath) {
    throw new PError(`Unable to find package from "${cwd}"`);
  }

  let pkg = await Package.init(pkgPath);
  let validScript = await yarn.run(pkg, opts.script, opts.scriptArgs);

  if (!validScript) {
    throw new PError(`Package at "${pkgPath}" does not have a script named "${opts.script}"`);
  }
}
