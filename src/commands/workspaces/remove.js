// @flow
import type { FilterOpts } from '../../types';
import * as options from '../../utils/options';
import Project from '../../Project';
import removeDependenciesFromPackages from '../../utils/removeDependenciesFromPackages';

type WorkspacesRemoveOptions = {
  cwd?: string,
  deps: Array<string>,
  filterOpts: FilterOpts
};

function toWorkspacesRemoveOptions(
  args: options.Args,
  flags: options.Flags
): WorkspacesRemoveOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    deps: args,
    filterOpts: options.toFilterOpts(flags)
  };
}

export async function workspacesRemove(
  flags: options.Flags,
  args: options.Args
) {
  let opts = toWorkspacesRemoveOptions(args, flags);
  let cwd = opts.cwd || process.cwd();
  let project = await Project.init(cwd);
  let workspaces = await project.getWorkspaces();
  let filteredWorkspaces = project.filterWorkspaces(
    workspaces,
    opts.filterOpts
  );

  await removeDependenciesFromPackages(
    project,
    workspaces,
    filteredWorkspaces.map(workspace => workspace.pkg),
    opts.deps
  );
}
