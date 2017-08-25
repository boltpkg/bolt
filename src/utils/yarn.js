// @flow
import type Package from '../Package';
import * as processes from './processes';

export async function run(pkg: Package, script: string, args: Array<string> = []) {
  let spawnArgs = ['run', script, '-s'];

  if (args.length) {
    spawnArgs = spawnArgs.concat('--', args);
  }

  await processes.spawn('yarn', spawnArgs, {
    cwd: pkg.dir,
    pkg: pkg,
  });
}
