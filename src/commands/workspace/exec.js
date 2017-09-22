// @flow
import Project from '../../Project';
import * as options from '../../utils/options';
import { PError } from '../../utils/errors';
import execCommand from '../../utils/execCommand';

export type WorkspaceExecOptions = {
  cwd?: string,
  workspaceName: string,
  command: string,
  commandArgs: options.Args
};

export function toWorkspaceExecOptions(
  args: options.Args,
  flags: options.Flags
): WorkspaceExecOptions {
  let [workspaceName] = args;
  let [command, ...commandArgs] = flags['--'] || [];
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    workspaceName,
    command,
    commandArgs
  };
}

export async function workspaceExec(opts: WorkspaceExecOptions) {
  let cwd = opts.cwd || process.cwd();
  let project = await Project.init(cwd);
  let workspaces = await project.getWorkspaces();
  let workspace = await project.getWorkspaceByName(
    workspaces,
    opts.workspaceName
  );

  if (!workspace) {
    throw new PError(
      `Could not find a workspace named "${opts.workspaceName}" from "${cwd}"`
    );
  }

  await execCommand(project, workspace.pkg, opts.command, opts.commandArgs);
}
