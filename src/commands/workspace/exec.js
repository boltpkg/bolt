// @flow
import Project from '../../Project';
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';
import execCommand from '../../utils/execCommand';

type WorkspaceExecOptions = {
  cwd?: string,
  workspaceName: string,
  command: string,
  commandArgs: options.Args
};

function toWorkspaceExecOptions(
  flags: options.Flags,
  args: options.Args
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

export async function workspaceExec(
  flags: options.Flags,
  subCommandArgs: Array<string>
) {
  let opts = toWorkspaceExecOptions(flags, subCommandArgs);
  let cwd = opts.cwd || process.cwd();
  let project = await Project.init(cwd);
  let workspaces = await project.getWorkspaces();
  let workspace = await project.getWorkspaceByName(
    workspaces,
    opts.workspaceName
  );

  if (!workspace) {
    throw new BoltError(
      `Could not find a workspace named "${opts.workspaceName}" from "${cwd}"`
    );
  }

  await execCommand(project, workspace.pkg, opts.command, opts.commandArgs);
}
