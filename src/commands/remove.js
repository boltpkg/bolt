// @flow
import Project from '../Project';
import Package from '../Package';
import * as options from '../utils/options';
import * as logger from '../utils/logger';
import removeDependenciesFromPackages from '../utils/removeDependenciesFromPackages';
import type { SpawnOpts } from '../types';

export type RemoveOptions = {|
  cwd?: string,
  deps: Array<string>,
  spawnOpts: SpawnOpts
|};

export function toRemoveOptions(
  args: options.Args,
  flags: options.Flags
): RemoveOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    deps: args,
    spawnOpts: options.toSpawnOpts(flags)
  };
}

export async function remove(opts: RemoveOptions) {
  let cwd = opts.cwd || process.cwd();
  let project = await Project.init(cwd);
  let packages = await project.getPackages();
  let pkg = await Package.closest(cwd);
  await removeDependenciesFromPackages(
    project,
    packages,
    [pkg],
    opts.deps,
    opts.spawnOpts
  );
}
