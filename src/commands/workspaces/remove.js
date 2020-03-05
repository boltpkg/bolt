// @flow
import type { SpawnOpts, FilterOpts } from '../../types';
import * as options from '../../utils/options';
import Project from '../../Project';
import removeDependenciesFromPackages from '../../utils/removeDependenciesFromPackages';

export type WorkspacesRemoveOptions = {
  cwd?: string,
  deps: Array<string>,
  spawnOpts: SpawnOpts,
  filterOpts: FilterOpts
};

export function toWorkspacesRemoveOptions(
  args: options.Args,
  flags: options.Flags
): WorkspacesRemoveOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    deps: args,
    spawnOpts: options.toSpawnOpts(flags),
    filterOpts: options.toFilterOpts(flags)
  };
}

export async function workspacesRemove(opts: WorkspacesRemoveOptions) {
  let cwd = opts.cwd || process.cwd();
  let project = await Project.init(cwd);
  let packages = await project.getPackages();
  let filteredPackages = project.filterPackages(packages, opts.filterOpts);

  await removeDependenciesFromPackages(
    project,
    packages,
    filteredPackages,
    opts.deps,
    opts.spawnOpts
  );
}
