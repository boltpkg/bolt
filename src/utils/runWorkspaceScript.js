// @flow
import spawn from './spawn';
import type Workspace from '../workspace';

export default async function runWorkspaceScript(workspace: Workspace, script: string, args: Array<string> = []) {
  let spawnArgs = ['run', script, '-s'];

  if (args.length) {
    spawnArgs = spawnArgs.concat('--', args);
  }

  if (workspace.pkg.config.scripts && workspace.pkg.config.scripts[script]) {
    await spawn('yarn', spawnArgs, {
      cwd: workspace.pkg.dir,
      pkg: workspace.pkg,
    });
  }
}
