// @flow
import includes from 'array-includes';

import type Package from '../Package';
import * as processes from './processes';
import * as fs from '../utils/fs';

export async function run(
  pkg: Package,
  script: string,
  args: Array<string> = []
) {
  let spawnArgs = ['run', '-s', script];

  if (args.length) {
    spawnArgs = spawnArgs.concat('--', args);
  }

  let validScript = false;

  if (pkg.config.scripts && pkg.config.scripts[script]) {
    validScript = true;
  }

  if (!validScript) {
    let bins = await fs.readdirSafe(pkg.nodeModulesBin);

    if (includes(bins, script)) {
      validScript = true;
    }
  }

  if (validScript) {
    await processes.spawn('yarn', spawnArgs, {
      cwd: pkg.dir,
      pkg: pkg,
      tty: true
    });
  }

  return validScript;
}

export async function init(cwd: string) {
  await processes.spawn('yarn', ['init', '-s'], {
    cwd: cwd,
    tty: true
  });
}
