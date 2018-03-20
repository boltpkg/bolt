// @flow
import Project from '../../Project';
import * as options from '../../utils/options';
import * as yarn from '../../utils/yarn';
import { BoltError } from '../../utils/errors';

export type WorkspaceRunOptions = {
  cwd?: string,
  pkgName: string,
  script: string,
  scriptArgs: options.Args
};

export function toWorkspaceRunOptions(
  args: options.Args,
  flags: options.Flags
): WorkspaceRunOptions {
  let [pkgName, script, ...scriptArgs] = args;
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    pkgName,
    script,
    scriptArgs
  };
}

export async function workspaceRun(opts: WorkspaceRunOptions) {
  let cwd = opts.cwd || process.cwd();
  let project = await Project.init(cwd);
  let packages = await project.getPackages();
  let pkg = await project.getPackageByName(packages, opts.pkgName);

  if (!pkg) {
    throw new BoltError(
      `Could not find a workspace named "${opts.pkgName}" from "${cwd}"`
    );
  }

  let validScript = await yarn.getScript(pkg, opts.script);

  if (!validScript) {
    throw new BoltError(
      `Package at "${pkg.dir}" does not have a script named "${opts.script}"`
    );
  }

  await yarn.run(pkg, opts.script, opts.scriptArgs);
}
