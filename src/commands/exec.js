// @flow
import Project from '../Project';
import Package from '../Package';
import * as options from '../utils/options';
import execCommand from '../utils/execCommand';

type ExecOptions = {|
  cwd?: string,
  command: string,
  commandArgs: options.Args
|};

function toExecOptions(args: options.Args, flags: options.Flags): ExecOptions {
  let [command, ...commandArgs] = flags['--'] || [];
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    command,
    commandArgs
  };
}

export async function exec(flags: options.Flags, commandArgs: Array<string>) {
  let opts = toExecOptions(commandArgs, flags);
  let cwd = opts.cwd || process.cwd();
  let project = await Project.init(cwd);
  let pkg = await Package.closest(cwd);
  return await execCommand(project, pkg, opts.command, opts.commandArgs);
}
