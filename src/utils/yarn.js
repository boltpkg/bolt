// @flow
import includes from 'array-includes';

import type { Dependency, configDependencyType } from '../types';
import type Package from '../Package';
import * as processes from './processes';
import * as fs from '../utils/fs';

export async function add(
  pkg: Package,
  dependencies: Array<Dependency>,
  type?: configDependencyType
) {
  const spawnArgs = ['add'];
  if (!dependencies.length) return;

  dependencies.forEach(dep => {
    if (dep.version) {
      spawnArgs.push(`${dep.name}@${dep.version}`);
    } else {
      spawnArgs.push(dep.name);
    }
  });

  if (type) {
    const typeToFlagMap = {
      dependencies: '',
      devDependencies: '--dev',
      peerDependencies: '--peer',
      optionalDependencies: '--optional'
    };
    const flag = typeToFlagMap[type];
    if (flag) spawnArgs.push(flag);
  }

  await processes.spawn('yarn', spawnArgs, {
    cwd: pkg.dir,
    pkg: pkg,
    tty: true
  });
}

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
