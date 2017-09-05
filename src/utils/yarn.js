// @flow
import type Package from '../Package';
import * as processes from './processes';

export async function run(pkg: Package, script: string, args: Array<string> = []) {
  let spawnArgs = ['run', script, '-s'];

  if (!pkg.config.scripts || !pkg.config.scripts[script]) return;

  if (args.length) {
    spawnArgs = spawnArgs.concat('--', args);
  }

  await processes.spawn('yarn', spawnArgs, {
    cwd: pkg.dir,
    pkg: pkg,
  });
}

export async function init(cwd: string) {
  await processes.spawn('yarn', ['init', '-s'], {
    cwd: cwd,
    tty: true,
  });
}
