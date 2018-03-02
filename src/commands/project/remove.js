// @flow
import Project from '../../Project';
import Package from '../../Package';
import * as options from '../../utils/options';
import * as logger from '../../utils/logger';
import removeDependenciesFromPackages from '../../utils/removeDependenciesFromPackages';

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

export async function remove(flags: options.Flags, args: options.Args) {
  let opts = toProjectRemoveOptions(args, flags);
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
