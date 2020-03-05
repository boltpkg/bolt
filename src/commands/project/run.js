// @flow
import Project from '../../Project';
import * as options from '../../utils/options';
import * as yarn from '../../utils/yarn';
import * as logger from '../../utils/logger';
import { BoltError } from '../../utils/errors';

export type ProjectRunOptions = {
  cwd?: string,
  script: string,
  scriptArgs: options.Args
};

export function toProjectRunOptions(
  args: options.Args,
  flags: options.Flags
): ProjectRunOptions {
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

export async function projectRun(opts: ProjectRunOptions) {
  let cwd = opts.cwd || process.cwd();
  let project = await Project.init(cwd);
  let script = await yarn.getScript(project.pkg, opts.script);

  if (script) {
    logger.cmd(script, opts.scriptArgs);
    await yarn.run(project.pkg, opts.script, opts.scriptArgs);
  } else {
    throw new BoltError(
      `Package at "${project.pkg.dir}" does not have a script named "${opts.script}"`
    );
  }
}
