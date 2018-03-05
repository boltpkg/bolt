// @flow
import Project from '../../Project';
import Package from '../../Package';
import * as options from '../../utils/options';
import * as logger from '../../utils/logger';
import removeDependenciesFromPackages from '../../utils/removeDependenciesFromPackages';
import type { SubCommandArgsType } from '../../types';

type ProjectRemoveOptions = {|
  cwd?: string,
  deps: Array<string>
|};

function toProjectRemoveOptions(
  args: options.Args,
  flags: options.Flags
): ProjectRemoveOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    deps: args
  };
}

export async function projectRemove({
  flags,
  subCommandArgs
}: SubCommandArgsType) {
  let opts = toProjectRemoveOptions(subCommandArgs, flags);
  let cwd = opts.cwd || process.cwd();
  let project = await Project.init(cwd);
  let workspaces = await project.getWorkspaces();

  await removeDependenciesFromPackages(
    project,
    workspaces,
    [project.pkg],
    opts.deps
  );
}
