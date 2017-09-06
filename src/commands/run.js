// @flow
import Project from '../Project';
import * as options from '../utils/options';
import * as yarn from '../utils/yarn';

export type RunOptions = {|
  cwd?: string,
  script: string,
  scriptArgs: options.Args,
|};

export function toRunOptions(args: options.Args, flags: options.Flags): RunOptions {
  let [script, ...scriptArgs] = args;
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    script,
    scriptArgs,
  };
}

export async function run(opts: RunOptions) {
  let cwd = opts.cwd || process.cwd();
  let project = await Project.init(cwd);
  await yarn.run(project.pkg, opts.script, opts.scriptArgs);
}
