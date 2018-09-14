// @flow
import Project from '../../Project';
import Package from '../../Package';
import * as options from '../../utils/options';
import { type SpawnOpts } from '../../types';
import * as logger from '../../utils/logger';
import removeDependenciesFromPackages from '../../utils/removeDependenciesFromPackages';

export type ProjectRemoveOptions = {|
  cwd?: string,
  deps: Array<string>,
  spawnOpts: SpawnOpts
|};

export function toProjectRemoveOptions(
  args: options.Args,
  flags: options.Flags
): ProjectRemoveOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    deps: args,
    spawnOpts: options.toSpawnOpts(flags)
  };
}

export async function projectRemove(opts: ProjectRemoveOptions) {
  let cwd = opts.cwd || process.cwd();
  let project = await Project.init(cwd);
  let packages = await project.getPackages();

  await removeDependenciesFromPackages(
    project,
    packages,
    [project.pkg],
    opts.deps,
    opts.spawnOpts
  );
}
