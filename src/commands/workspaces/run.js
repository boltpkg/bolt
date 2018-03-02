// @flow
import type { FilterOpts } from '../../types';
import * as options from '../../utils/options';
import Project from '../../Project';
import * as yarn from '../../utils/yarn';

type WorkspacesRunOptions = {
  cwd?: string,
  script: string,
  scriptArgs: options.Args,
  filterOpts: FilterOpts
};

function toWorkspacesRunOptions(
  args: options.Args,
  flags: options.Flags
): WorkspacesRunOptions {
  let [script, ...scriptArgs] = args;
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    script,
    scriptArgs,
    filterOpts: options.toFilterOpts(flags)
  };
}

export async function run(flags: options.Flags, args: options.Args) {
  let opts = toWorkspacesRunOptions(args, flags);
  let cwd = opts.cwd || process.cwd();
  let project = await Project.init(cwd);
  let workspaces = await project.getWorkspaces();
  let filteredWorkspaces = project.filterWorkspaces(
    workspaces,
    opts.filterOpts
  );

  await project.runWorkspaceTasks(filteredWorkspaces, async workspace => {
    // no need to error if script doesn't exist
    await yarn.runIfExists(workspace.pkg, opts.script, opts.scriptArgs);
  });
}
