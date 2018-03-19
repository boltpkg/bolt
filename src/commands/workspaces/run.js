// @flow
import type { FilterOpts } from '../../types';
import * as options from '../../utils/options';
import Project from '../../Project';
import * as yarn from '../../utils/yarn';

export type WorkspacesRunOptions = {
  cwd?: string,
  script: string,
  scriptArgs: options.Args,
  filterOpts: FilterOpts
};

export function toWorkspacesRunOptions(
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

export async function workspacesRun(opts: WorkspacesRunOptions) {
  let cwd = opts.cwd || process.cwd();
  let project = await Project.init(cwd);
  let packages = await project.getPackages();
  let filteredPackages = project.filterPackages(packages, opts.filterOpts);

  await project.runPackageTasks(filteredPackages, async pkg => {
    // no need to error if script doesn't exist
    await yarn.runIfExists(pkg, opts.script, opts.scriptArgs);
  });
}
