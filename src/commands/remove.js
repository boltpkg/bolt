// @flow
import Project from '../Project';
import Package from '../Package';
import * as options from '../utils/options';
import * as logger from '../utils/logger';
import removeDependenciesFromPackages from '../utils/removeDependenciesFromPackages';

type RemoveOptions = {|
  cwd?: string,
  deps: Array<string>
|};

function toRemoveOptions(
  args: options.Args,
  flags: options.Flags
): RemoveOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    deps: args
  };
}

export async function remove(flags: options.Flags, commandArgs: Array<string>) {
  let opts = toRemoveOptions(commandArgs, flags);
  let cwd = opts.cwd || process.cwd();
  let project = await Project.init(cwd);
  let workspaces = await project.getWorkspaces();
  let pkg = await Package.closest(cwd);
  await removeDependenciesFromPackages(project, workspaces, [pkg], opts.deps);
}
