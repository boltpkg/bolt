// @flow
import Package from '../Package';
import * as options from '../utils/options';
import * as yarn from '../utils/yarn';
import * as logger from '../utils/logger';
import { BoltError } from '../utils/errors';

export type RunOptions = {|
  cwd?: string,
  script: string,
  scriptArgs: options.Args
|};

export function toRunOptions(
  args: options.Args,
  flags: options.Flags
): RunOptions {
  /**
   * Unfortunately, in run commands, we are unable to use meow's parsed flags and args as we really
   * want to be able to pass all args and flags to yarn without modification. For example, we could
   * get a flag called `t` and we wont know if `t` was passed in with `--t` or `-t` and could pass it in
   * incorrectly. The only other alternative would be to pass in all flags using the `--` separator
   * and args on the other side e.g `bolt run test src/* -- --watch --bail` which is further away from
   * how yarn handles things and is more complicated for the consumer.
   */
  let [script] = args;
  const scriptArgIdx = process.argv.indexOf(script);
  // the flags that we'll be passing in as args start after the script name, and we'll pass them all directly
  const scriptArgs = process.argv.slice(scriptArgIdx + 1);

  return {
    cwd: options.string(flags.cwd, 'cwd'),
    script,
    scriptArgs
  };
}

export async function run(opts: RunOptions) {
  let cwd = opts.cwd || process.cwd();
  let pkg = await Package.closest(cwd);
  let script = await yarn.getScript(pkg, opts.script);

  if (script) {
    logger.cmd(script, opts.scriptArgs);
    await yarn.run(pkg, opts.script, opts.scriptArgs);
  } else {
    throw new BoltError(
      `Package at "${pkg.dir}" does not have a script named "${opts.script}"`
    );
  }
}
