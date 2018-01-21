// @flow
import Package from '../Package';
import * as logger from '../utils/logger';
import * as messages from '../utils/messages';
import * as options from '../utils/options';
import * as yarn from '../utils/yarn';
import { run } from './run';

export type TestOptions = {|
  cwd?: string,
  args: options.Args
|};

export function toTestOptions(
  args: options.Args,
  flags: options.Flags
): TestOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    args: args
  };
}

export async function test(opts: TestOptions) {
  let script = 'test';
  let cwd = opts.cwd || process.cwd();
  let pkg = await Package.closest(cwd);
  let testScript = await yarn.getScript(pkg, 'test');

  if (!testScript) {
    logger.warn(messages.runningDefaultScript('test', 'jest', pkg.dir), {
      emoji: '😎',
      prefix: false
    });
    script = 'jest';
  }

  await run({
    cwd: opts.cwd,
    script,
    scriptArgs: opts.args
  });
}
