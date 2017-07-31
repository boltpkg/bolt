// @flow
import crossSpawn from 'cross-spawn';

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

export default function spawn(cmd: string, args: Array<string>, opts: child_process$spawnOpts = {}) {
  return new Promise((resolve, reject) => {
    let stdoutBuf = Buffer.from('');
    let stderrBuf = Buffer.from('');

    if (!opts.stdio) {
      opts.stdio = 'inherit';
    }

    let child = crossSpawn(cmd, args, opts);

    if (child.stdout) {
      child.stdout.on('data', data => {
        stdoutBuf = Buffer.concat([stdoutBuf, data]);
      });
    }

    if (child.stderr) {
      child.stderr.on('data', data => {
        stderrBuf = Buffer.concat([stderrBuf, data]);
      });
    }

    child.on('error', reject);

    child.on('close', code => {
      let stdout = stdoutBuf.toString();
      let stderr = stderrBuf.toString();

      if (code === 0) {
        resolve({code, stdout, stderr});
      } else {
        reject(new ChildProcessError(code, stdout, stderr));
      }
    });
  });
}
