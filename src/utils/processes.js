// @flow
import crossSpawn from 'cross-spawn';
import * as logger from './logger';
import * as cleanUp from './cleanUp';
import type Package from '../Package';
import type Project from '../Project';
import pLimit from 'p-limit';
import os from 'os';
import path from 'path';
import { globalOptions, type GlobalOptions } from '../GlobalOptions';

const limit = pLimit(os.cpus().length);
const processes = new Set();

export function handleSignals() {
  cleanUp.handleAllSignals(() => {
    for (let child of processes) {
      child.kill('SIGTERM');
    }
    processes.clear();
  });
}

export class ChildProcessError extends Error {
  code: number;
  stdout: string;
  stderr: string;

  constructor(code: number, stdout: string, stderr: string) {
    super(stderr);

    Error.captureStackTrace(this, this.constructor);

    this.code = code;
    this.stdout = stdout;
    this.stderr = stderr;
  }
}

export type SpawnOptions = {
  ...GlobalOptions,
  cwd?: string,
  pkg?: Package,
  silent?: boolean,
  tty?: boolean,
  useBasename?: boolean,
  env?: { [key: string]: ?string }
};

export function spawn(
  cmd: string,
  args: Array<string>,
  opts: SpawnOptions = {}
) {
  return limit(
    () =>
      new Promise((resolve, reject) => {
        let stdoutBuf = Buffer.from('');
        let stderrBuf = Buffer.from('');
        let isTTY = process.stdout.isTTY && opts.tty;
        let cmdDisplayName = opts.useBasename ? path.basename(cmd) : cmd;

        let displayCmd =
          opts.disableCmdPrefix != null
            ? opts.disableCmdPrefix
            : globalOptions.get('disableCmdPrefix');
        let cmdStr = displayCmd ? '' : cmdDisplayName + ' ' + args.join(' ');

        let spawnOpts: child_process$spawnOpts = {
          cwd: opts.cwd,
          env: opts.env || process.env
        };

        if (isTTY) {
          spawnOpts.shell = true;
          spawnOpts.stdio = 'inherit';
        }

        let child = crossSpawn(cmd, args, spawnOpts);

        processes.add(child);

        if (child.stdout) {
          child.stdout.on('data', data => {
            if (!opts.silent) {
              logger.stdout(cmdStr, data, opts.pkg);
            }

            stdoutBuf = Buffer.concat([stdoutBuf, data]);
          });
        }

        if (child.stderr) {
          child.stderr.on('data', data => {
            if (!opts.silent) {
              logger.stderr(cmdStr, data, opts.pkg);
            }
            stderrBuf = Buffer.concat([stderrBuf, data]);
          });
        }

        child.on('error', reject);

        child.on('close', code => {
          let stdout = stdoutBuf.toString();
          let stderr = stderrBuf.toString();

          processes.delete(child);

          if (code === 0) {
            resolve({ code, stdout, stderr });
          } else {
            reject(new ChildProcessError(code, stdout, stderr));
          }
        });
      })
  );
}
