// @flow
import Project from '../../Project';
import Package from '../../Package';
import * as options from '../../utils/options';
import * as logger from '../../utils/logger';
import removeDependenciesFromPackages from '../../utils/removeDependenciesFromPackages';
import { BoltError } from '../../utils/errors';
import type { SpawnOpts } from '../../types';

export type WorkspaceRemoveOptions = {
  cwd?: string,
  pkgName: string,
  deps: Array<string>,
  spawnOpts: SpawnOpts
};

export function toWorkspaceRemoveOptions(
  args: options.Args,
  flags: options.Flags
): WorkspaceRemoveOptions {
  let [pkgName, ...deps] = args;
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    pkgName,
    deps,
    spawnOpts: options.toSpawnOpts(flags)
  };
}

export async function workspaceRemove(opts: WorkspaceRemoveOptions) {
  let cwd = opts.cwd || process.cwd();
  let project = await Project.init(cwd);
  let packages = await project.getPackages();
  let pkg = await project.getPackageByName(packages, opts.pkgName);

  if (!pkg) {
    throw new BoltError(
      `Could not find a workspace named "${opts.pkgName}" from "${cwd}"`
    );
  }

  await removeDependenciesFromPackages(
    project,
    packages,
    [pkg],
    opts.deps,
    opts.spawnOpts
  );
}
