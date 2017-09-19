// @flow
import Project from '../../Project';
import Package from '../../Package';
import * as options from '../../utils/options';
import * as logger from '../../utils/logger';
import removeDependenciesFromPackages from '../../utils/removeDependenciesFromPackages';
import { PError } from '../../utils/errors';

export type WorkspaceRemoveOptions = {
  cwd?: string,
  workspaceName: string,
  deps: Array<string>
};

export function toWorkspaceRemoveOptions(
  args: options.Args,
  flags: options.Flags
): WorkspaceRemoveOptions {
  let [workspaceName, ...deps] = args;
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    workspaceName,
    deps
  };
}

export async function workspaceRemove(opts: WorkspaceRemoveOptions) {
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

  await removeDependenciesFromPackages(
    project,
    workspaces,
    [workspace.pkg],
    opts.deps
  );
}
