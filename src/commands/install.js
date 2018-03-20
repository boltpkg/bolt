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
import * as yarn from '../utils/yarn';
import pathIsInside from 'path-is-inside';
import { BoltError } from '../utils/errors';
import { BOLT_VERSION } from '../constants';

export type InstallOptions = {|
  cwd?: string,
  pureLockfile: boolean
|};

export function toInstallOptions(
  args: options.Args,
  flags: options.Flags
): InstallOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    pureLockfile: options.boolean(flags.pureLockfile, 'pure-lockfile') || false
  };
}

export async function install(opts: InstallOptions) {
  let cwd = opts.cwd || process.cwd();
  let project = await Project.init(cwd);
  let packages = await project.getPackages();
  let installFlags = [];

  if (opts.pureLockfile) installFlags.push('--pure-lockfile');

  logger.info(messages.validatingProject(), { emoji: '🔎', prefix: false });

  let projectIsValid = await validateProject(project);
  if (!projectIsValid) {
    throw new BoltError(messages.unableToInstall());
  }

  logger.info(messages.installingProjectDependencies(), {
    emoji: '📦',
    prefix: false
  });

  let yarnUserAgent = await yarn.userAgent();
  let boltUserAgent = `bolt/${BOLT_VERSION} ${yarnUserAgent}`;

  await processes.spawn('yarn', ['install', ...installFlags], {
    cwd: project.pkg.dir,
    tty: true,
    env: { ...process.env, npm_config_user_agent: boltUserAgent }
  });

  logger.info(messages.linkingWorkspaceDependencies(), {
    emoji: '🔗',
    prefix: false
  });

  for (let pkg of packages) {
    let dependencies = pkg.getAllDependencies().keys();
    await symlinkPackageDependencies(project, pkg, dependencies);
  }

  logger.success(messages.installedAndLinkedWorkspaces(), { emoji: '💥' });
}
