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
  let [script, ...scriptArgs] = args;
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
      `Package at "${project.pkg
        .dir}" does not have a script named "${opts.script}"`
    );
  }
}
