// @flow
import Project from '../Project';
import * as options from '../utils/options';
import * as locks from '../utils/locks';

type PublishLockOptions = {|
  cwd?: string
|};

function toPublishLockOptions(
  args: options.Args,
  flags: options.Flags
): PublishLockOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd')
  };
}

export async function publishLock(
  flags: options.Flags,
  commandArgs: Array<string>
) {
  let opts = toPublishLockOptions(commandArgs, flags);
  let cwd = opts.cwd || process.cwd();
  let project = await Project.init(cwd);
  let workspaces = await project.getWorkspaces();

  let packages = workspaces
    .map(workspace => workspace.pkg)
    .filter(pkg => !pkg.config.getPrivate());

  await locks.lock(packages);
}
