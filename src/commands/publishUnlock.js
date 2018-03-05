// @flow
import Project from '../Project';
import * as options from '../utils/options';
import * as locks from '../utils/locks';
import type { CommandArgsType } from '../types';

type PublishUnlockOptions = {|
  cwd?: string
|};

function toPublishUnlockOptions(
  args: options.Args,
  flags: options.Flags
): PublishUnlockOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd')
  };
}

export async function publishUnlock({ commandArgs, flags }: CommandArgsType) {
  let opts = toPublishUnlockOptions(commandArgs, flags);
  let cwd = opts.cwd || process.cwd();
  let project = await Project.init(cwd);
  let workspaces = await project.getWorkspaces();

  let packages = workspaces
    .map(workspace => workspace.pkg)
    .filter(pkg => !pkg.config.getPrivate());
  await locks.unlock(packages);
}
