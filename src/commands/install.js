// @flow
import Project from '../Project';
import * as options from '../utils/options';
import * as processes from '../utils/processes';
import * as fs from '../utils/fs';
import * as path from 'path';
import * as logger from '../utils/logger';
import * as messages from '../utils/messages';
import symlinkPackageDependencies from '../utils/symlinkPackageDependencies';
import * as yarn from '../utils/yarn';
import pathIsInside from 'path-is-inside';
import { PError } from '../utils/errors';

export type InstallOptions = {|
  cwd?: string
|};

export function toInstallOptions(
  args: options.Args,
  flags: options.Flags
): InstallOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd')
  };
}

export async function install(opts: InstallOptions) {
  let cwd = opts.cwd || process.cwd();
  let project = await Project.init(cwd);
  let workspaces = await project.getWorkspaces();

  logger.log('[1/2] Installing project dependencies...');

  await processes.spawn('yarn', ['install', '--non-interactive', '-s'], {
    cwd: project.pkg.dir
  });

  logger.log(`[2/2] Linking ${workspaces.length} workspace dependencies...`);

  for (let workspace of workspaces) {
    const dependencies = workspace.pkg.getAllDependencies().keys();
    await symlinkPackageDependencies(project, workspace.pkg, dependencies);
  }

  logger.success('Installed and linked workspaces.');
}
