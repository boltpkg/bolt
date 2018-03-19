// @flow
import Project from '../../Project';
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';
import execCommand from '../../utils/execCommand';

export type WorkspaceExecOptions = {
  cwd?: string,
  pkgName: string,
  command: string,
  commandArgs: options.Args
};

export function toWorkspaceExecOptions(
  args: options.Args,
  flags: options.Flags
): WorkspaceExecOptions {
  let [pkgName] = args;
  let [command, ...commandArgs] = flags['--'] || [];
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    pkgName,
    command,
    commandArgs
  };
}

export async function workspaceExec(opts: WorkspaceExecOptions) {
  let cwd = opts.cwd || process.cwd();
  let project = await Project.init(cwd);
  let packages = await project.getPackages();
  let pkg = await project.getPackageByName(packages, opts.pkgName);

  if (!pkg) {
    throw new BoltError(
      `Could not find a workspace named "${opts.pkgName}" from "${cwd}"`
    );
  }

  await execCommand(project, pkg, opts.command, opts.commandArgs);
}
