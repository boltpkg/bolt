// @flow
import Project from '../Project';
import * as options from '../utils/options';
import * as processes from '../utils/processes';
import * as fs from '../utils/fs';
import * as path from 'path';
import * as logger from '../utils/logger';
import * as yarn from '../utils/yarn';
import { PError } from '../utils/errors';
import { symlinkWorkspaces } from '../utils/install';

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

  await Project.runWorkspaceTasks(workspaces, async workspace => {
    await yarn.run(workspace.pkg, 'preinstall');
  });

  logger.log('[1/2] Installing project dependencies...');

  await processes.spawn('yarn', ['install', '--non-interactive', '-s'], {
    cwd: project.pkg.dir
  });

  logger.log('[2/2] Linking workspace dependencies...');

  await symlinkWorkspaces({ cwd });

  logger.success('Installed and linked workspaces.');
}
