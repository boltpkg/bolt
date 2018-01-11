// @flow
import crossSpawn from 'cross-spawn';
import * as logger from './logger';
import type Package from '../Package';
import pLimit from 'p-limit';
import os from 'os';

const limit = pLimit(os.cpus().length);
const processes = new Set();

export function handleSignals() {
  process.on('SIGTERM', () => {
    for (let child of processes) {
      child.kill('SIGTERM');
    }
    process.exit(1);
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
  cwd?: string,
  pkg?: Package,
  silent?: boolean,
  tty?: boolean,
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

        let cmdStr = cmd + ' ' + args.join(' ');

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
