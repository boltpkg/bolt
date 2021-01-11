// @flow
import Project from '../Project';
import * as options from '../utils/options';
import * as processes from '../utils/processes';
import * as fs from '../utils/fs';
import * as path from 'path';
import * as logger from '../utils/logger';
import * as messages from '../utils/messages';
import validateProject from '../utils/validateProject';
import symlinkPackageDependencies from '../utils/symlinkPackageDependencies';
import symlinkPackagesBinaries from '../utils/symlinkPackagesBinariesToProject';
import * as yarn from '../utils/yarn';
import pathIsInside from 'path-is-inside';
import { BoltError } from '../utils/errors';
import { BOLT_VERSION } from '../constants';
import type { LockFileMode } from '../utils/yarn';

export type InstallOptions = {|
  cwd?: string,
  lockfileMode: LockFileMode
|};

export function toInstallOptions(
  args: options.Args,
  flags: options.Flags
): InstallOptions {
  let lockfileMode: LockFileMode = 'default';
  // in order of strictness:
  if (options.boolean(flags.frozenLockfile, 'frozen-lockfile')) {
    lockfileMode = 'frozen';
  } else if (options.boolean(flags.pureLockfile, 'pure-lockfile')) {
    lockfileMode = 'pure';
  }
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    lockfileMode
  };
}

export async function install(opts: InstallOptions) {
  let cwd = opts.cwd || process.cwd();
  let project = await Project.init(cwd);
  let packages = await project.getPackages();

  logger.info(messages.validatingProject(), { emoji: '🔎', prefix: false });

  let projectIsValid = await validateProject(project);
  if (!projectIsValid) {
    throw new BoltError(messages.unableToInstall());
  }

  logger.info(messages.installingProjectDependencies(), {
    emoji: '📦',
    prefix: false
  });

  await yarn.install(project.pkg.dir, opts.lockfileMode);

  logger.info(messages.linkingWorkspaceDependencies(), {
    emoji: '🔗',
    prefix: false
  });

  let { graph, valid } = await project.getDependencyGraph(packages);
  if (!valid) {
    throw new BoltError('Cannot symlink invalid set of dependencies.');
  }

  await Promise.all(packages.map(async (pkg) => {
    let dependencies = Array.from(pkg.getAllDependencies().keys());
    await symlinkPackageDependencies(project, pkg, dependencies, graph);
  }));

  logger.info(messages.linkingWorkspaceBinaries(), {
    emoji: '🚀',
    prefix: false
  });

  await symlinkPackagesBinaries(project);

  logger.success(messages.installedAndLinkedWorkspaces(), { emoji: '💥' });
}
