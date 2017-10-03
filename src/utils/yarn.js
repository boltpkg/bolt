// @flow
import includes from 'array-includes';

import type { Dependency, configDependencyType } from '../types';
import type Package from '../Package';
import * as processes from './processes';
import * as fs from '../utils/fs';
import * as logger from '../utils/fs';

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

  await processes.spawn('yarn', spawnArgs, {
    cwd: pkg.dir,
    pkg: pkg,
    tty: true
  });
}

export async function getScript(pkg: Package, script: string) {
  let result = null;
  let scripts = pkg.config.getScripts();

  if (scripts && scripts[script]) {
    result = scripts[script];
  }

  if (!result) {
    let bins = await fs.readdirSafe(pkg.nodeModulesBin);

    if (includes(bins, script)) {
      result = script;
    }
  }

  return result;
}

export async function init(cwd: string) {
  await processes.spawn('yarn', ['init', '-s'], {
    cwd: cwd,
    tty: true
  });
}

export async function remove(dependencies: Array<string>, cwd: string) {
  await processes.spawn('yarn', ['remove', ...dependencies], {
    cwd,
    tty: true
  });
}
