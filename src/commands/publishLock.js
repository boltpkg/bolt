// @flow
import Project from '../Project';
import * as options from '../utils/options';
import * as locks from '../utils/locks';

export type PublishLockOptions = {|
  cwd?: string
|};

export function toPublishLockOptions(
  args: options.Args,
  flags: options.Flags
): PublishLockOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd')
  };
}

export async function publishLock(opts: PublishLockOptions) {
  let cwd = opts.cwd || process.cwd();
  let project = await Project.init(cwd);
  let packages = await project.getPackages();
  let publicPackages = packages.filter(pkg => !pkg.config.getPrivate());
  await locks.lock(publicPackages);
}
