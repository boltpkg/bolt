// @flow
import includes from 'array-includes';
import type { Dependency, configDependencyType } from '../types';
import type Package from '../Package';
import * as processes from './processes';
import * as fs from '../utils/fs';
import { DEPENDENCY_TYPE_FLAGS_MAP, BOLT_VERSION } from '../constants';

function depTypeToFlag(depType) {
  let flag = Object.keys(DEPENDENCY_TYPE_FLAGS_MAP).find(
    key => DEPENDENCY_TYPE_FLAGS_MAP[key] === depType
  );

  return flag ? `--${flag}` : flag;
}

async function getEnvWithUserAgents() {
  let yarnUserAgent = await userAgent();
  let boltUserAgent = `bolt/${BOLT_VERSION} ${yarnUserAgent}`;

  return {
    ...process.env,
    npm_config_user_agent: boltUserAgent,
    bolt_config_user_agent: boltUserAgent
  };
}

/* Add the relevant *_config_user_agent env vars to all spawned yarn processes */
async function spawnWithUserAgent(
  cmd: string,
  args: string[],
  opts?: processes.SpawnOptions
) {
  return processes.spawn(cmd, args, {
    ...opts,
    env: {
      ...(await getEnvWithUserAgents()),
      ...(opts && opts.env)
    }
  });
}

export type LockFileMode = 'default' | 'pure' | 'frozen';

export async function install(
  cwd: string,
  lockfileMode: LockFileMode = 'default'
) {
  let installFlags = [];

  switch (lockfileMode) {
    case 'frozen':
      installFlags.push('--frozen-lockfile');
      break;
    case 'pure':
      installFlags.push('--pure-lockfile');
      break;
    default:
      break;
  }

  await spawnWithUserAgent('npx', ['yarn', 'install', ...installFlags], {
    cwd,
    tty: true,
    useBasename: true
  });
}

export async function add(
  pkg: Package,
  dependencies: Array<Dependency>,
  type?: configDependencyType
) {
  let spawnArgs = ['yarn', 'add'];
  if (!dependencies.length) return;

  dependencies.forEach(dep => {
    if (dep.version) {
      spawnArgs.push(`${dep.name}@${dep.version}`);
    } else {
      spawnArgs.push(dep.name);
    }
  });

  if (type) {
    let flag = depTypeToFlag(type);
    if (flag) spawnArgs.push(flag);
  }

  await spawnWithUserAgent('npx', spawnArgs, {
    cwd: pkg.dir,
    pkg: pkg,
    tty: true
  });
}

export async function upgrade(
  pkg: Package,
  dependencies: Array<Dependency> = [],
  flags: Array<string> = []
) {
  let spawnArgs = ['yarn', 'upgrade'];

  if (dependencies.length) {
    dependencies.forEach(dep => {
      if (dep.version) {
        spawnArgs.push(`${dep.name}@${dep.version}`);
      } else {
        spawnArgs.push(dep.name);
      }
    });
  }

  await spawnWithUserAgent('npx', [...spawnArgs, ...flags], {
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
  let spawnArgs = ['yarn', 'run', '-s', script];
  if (args.length) {
    spawnArgs = spawnArgs.concat(args);
  }
  await spawnWithUserAgent('npx', spawnArgs, {
    cwd: pkg.dir,
    pkg: pkg,
    tty: true,
    useBasename: true
  });
}

export async function runIfExists(
  pkg: Package,
  script: string,
  args: Array<string> = []
) {
  let scriptExists = await getScript(pkg, script);
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

export async function remove(dependencies: Array<string>, cwd: string) {
  await spawnWithUserAgent('npx', ['yarn', 'remove', ...dependencies], {
    cwd,
    tty: true
  });
}

export async function cliCommand(
  cwd: string,
  command: string = '',
  spawnArgs: Array<string> = []
) {
  return await spawnWithUserAgent('npx', ['yarn', command, ...spawnArgs], {
    cwd,
    tty: true,
    useBasename: true
  });
}

export async function info(cwd: string, spawnArgs: Array<string> = []) {
  await spawnWithUserAgent('npx', ['yarn', 'info', ...spawnArgs], {
    cwd,
    tty: true
  });
}

export async function userAgent() {
  let { stdout: yarnUserAgent } = await processes.spawn(
    'npx',
    ['yarn', 'config', 'get', 'user-agent'],
    {
      tty: false
    }
  );

  return yarnUserAgent.replace(/\n/g, '');
}

export async function globalCli(
  command: string = '',
  dependencies: Array<Dependency>
) {
  let spawnArgs = ['global', command];
  if (!dependencies.length) return;

  dependencies.forEach(dep => {
    if (dep.version) {
      spawnArgs.push(`${dep.name}@${dep.version}`);
    } else {
      spawnArgs.push(dep.name);
    }
  });

  await spawnWithUserAgent('yarn', spawnArgs, {
    tty: true
  });
}
