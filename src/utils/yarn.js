// @flow
import includes from 'array-includes';
import pkgDir from 'pkg-dir';
import * as path from 'path';
import type { Dependency, configDependencyType } from '../types';
import type Package from '../Package';
import * as processes from './processes';
import * as fs from '../utils/fs';
import * as logger from '../utils/fs';
import { DEPENDENCY_TYPE_FLAGS_MAP } from '../constants';

async function getLocalYarn() {
  const projectDir = await pkgDir(__dirname);
  return path.join(projectDir, 'node_modules', '.bin', 'yarn');
}

function depTypeToFlag(depType) {
  const flag = Object.keys(DEPENDENCY_TYPE_FLAGS_MAP).find(
    key => DEPENDENCY_TYPE_FLAGS_MAP[key] === depType
  );

  return flag ? `--${flag}` : flag;
}

export async function add(
  pkg: Package,
  dependencies: Array<Dependency>,
  type?: configDependencyType
) {
  const localYarn = await getLocalYarn();
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
    const flag = depTypeToFlag(type);
    if (flag) spawnArgs.push(flag);
  }

  await processes.spawn(localYarn, spawnArgs, {
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
  const localYarn = await getLocalYarn();
  let spawnArgs = ['run', '-s', script];

  if (args.length) {
    spawnArgs = spawnArgs.concat('--', args);
  }

  await processes.spawn(localYarn, spawnArgs, {
    cwd: pkg.dir,
    pkg: pkg,
    tty: true
  });
}

export async function runIfExists(
  pkg: Package,
  script: string,
  args: Array<string> = []
) {
  const scriptExists = await getScript(pkg, script);
  if (scriptExists) {
    await run(pkg, script, args);
  }
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
  const localYarn = await getLocalYarn();
  await processes.spawn(localYarn, ['init', '-s'], {
    cwd: cwd,
    tty: true
  });
}

export async function remove(dependencies: Array<string>, cwd: string) {
  const localYarn = await getLocalYarn();
  await processes.spawn(localYarn, ['remove', ...dependencies], {
    cwd,
    tty: true
  });
}

export async function bin(cwd: string) {
  const localYarn = await getLocalYarn();
  await processes.spawn(localYarn, ['bin'], {
    cwd,
    tty: true
  });
}
