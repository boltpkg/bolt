// @flow
import Project from '../Project';
import * as options from '../utils/options';
import * as locks from '../utils/locks';

export type PublishUnlockOptions = {|
  cwd?: string
|};

export function toPublishUnlockOptions(
  args: options.Args,
  flags: options.Flags
): PublishUnlockOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd')
  };
}

export async function publishUnlock(opts: PublishUnlockOptions) {
  let cwd = opts.cwd || process.cwd();
  let project = await Project.init(cwd);
  let packages = await project.getPackages();
  let publicPackages = packages.filter(pkg => !pkg.config.getPrivate());
  await locks.unlock(publicPackages);
}
