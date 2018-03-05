// @flow
import Project from '../../Project';
import * as options from '../../utils/options';
import * as yarn from '../../utils/yarn';
import { BoltError } from '../../utils/errors';
import type { SubCommandArgsType } from '../../types';

type ProjectRunOptions = {
  cwd?: string,
  script: string,
  scriptArgs: options.Args
};

function toProjectRunOptions(
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

export async function projectRun({
  flags,
  subCommandArgs
}: SubCommandArgsType) {
  let opts = toProjectRunOptions(subCommandArgs, flags);
  let cwd = opts.cwd || process.cwd();
  let project = await Project.init(cwd);
  let validScript = await yarn.run(project.pkg, opts.script, opts.scriptArgs);

  if (!validScript) {
    throw new BoltError(
      `Package at "${project.pkg
        .dir}" does not have a script named "${opts.script}"`
    );
  }
}
