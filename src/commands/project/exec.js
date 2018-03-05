// @flow
import Project from '../../Project';
import * as options from '../../utils/options';
import execCommand from '../../utils/execCommand';
import type { SubCommandArgsType } from '../../types';

type ProjectExecOptions = {
  cwd?: string,
  command: string,
  commandArgs: options.Args
};

function toProjectExecOptions(
  args: options.Args,
  flags: options.Flags
): ProjectExecOptions {
  let [command, ...commandArgs] = flags['--'] || [];
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    command,
    commandArgs
  };
}

export async function projectExec({
  flags,
  subCommandArgs
}: SubCommandArgsType) {
  let opts = toProjectExecOptions(subCommandArgs, flags);
  let cwd = opts.cwd || process.cwd();
  let project = await Project.init(cwd);
  await execCommand(project, project.pkg, opts.command, opts.commandArgs);
}
