// @flow
import Project from '../../Project';
import * as options from '../../utils/options';
import * as yarn from '../../utils/yarn';
import { BoltError } from '../../utils/errors';

export type WorkspaceRunOptions = {
  cwd?: string,
  workspaceName: string,
  script: string,
  scriptArgs: options.Args
};

export function toWorkspaceRunOptions(
  args: options.Args,
  flags: options.Flags
): WorkspaceRunOptions {
  let [workspaceName, script, ...scriptArgs] = args;
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    workspaceName,
    script,
    scriptArgs
  };
}

export async function workspaceRun(opts: WorkspaceRunOptions) {
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

  let validScript = await yarn.run(workspace.pkg, opts.script, opts.scriptArgs);

  if (!validScript) {
    throw new BoltError(
      `Package at "${workspace.pkg
        .dir}" does not have a script named "${opts.script}"`
    );
  }
}
