// @flow
import includes from 'array-includes';

import type { Dependency, configDependencyType } from '../types';
import type Package from '../Package';
import Project from '../Project';
import * as processes from './processes';
import * as fs from '../utils/fs';
import * as logger from '../utils/fs';
import { DEPENDENCY_TYPE_FLAGS_MAP } from '../constants';

async function getProjectBinPath(cwd: string): Promise<string> {
  const project = await Project.init(cwd);
  return project.pkg.nodeModulesBin;
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
  const projectBinPath = await getProjectBinPath(pkg.dir);
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

  await processes.spawn(`${projectBinPath}/yarn`, spawnArgs, {
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
  const projectBinPath = await getProjectBinPath(pkg.dir);
  let spawnArgs = ['run', '-s', script];

  if (args.length) {
    spawnArgs = spawnArgs.concat('--', args);
  }

  await processes.spawn(`${projectBinPath}/yarn`, spawnArgs, {
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
  const projectBinPath = await getProjectBinPath(cwd);
  await processes.spawn(`${projectBinPath}/yarn`, ['init', '-s'], {
    cwd: cwd,
    tty: true
  });
}

export async function remove(dependencies: Array<string>, cwd: string) {
  const projectBinPath = await getProjectBinPath(cwd);
  await processes.spawn(`${projectBinPath}/yarn`, ['remove', ...dependencies], {
    cwd,
    tty: true
  });
}

export async function bin(cwd: string) {
  const projectBinPath = await getProjectBinPath(cwd);
  await processes.spawn(`${projectBinPath}/yarn`, ['bin'], {
    cwd,
    tty: true
  });
}
