// @flow
import Project from '../../Project';
import * as options from '../../utils/options';
import * as yarn from '../../utils/yarn';
import {PError} from '../../utils/errors';

export type ProjectRunOptions = {
  cwd?: string,
  script: string,
  scriptArgs: options.Args,
};

export function toProjectRunOptions(args: options.Args, flags: options.Flags): ProjectRunOptions {
  let [script, ...scriptArgs] = args;
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    script,
    scriptArgs,
  };
}

export async function projectRun(opts: ProjectRunOptions) {
  let cwd = opts.cwd || process.cwd();
  let project = await Project.init(cwd);
  let validScript = await yarn.run(project.pkg, opts.script, opts.scriptArgs);

  if (!validScript) {
    throw new PError(`Package at "${project.pkg.dir}" does not have a script named "${opts.script}"`);
  }
}
