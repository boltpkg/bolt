// @flow
import * as options from '../../utils/options';
import Project from '../../Project';
import * as yarn from '../../utils/yarn';

export type WorkspaceRunOptions = {
  cwd?: string,
  script: string,
  scriptArgs: options.Args,
};

export function toWorkspaceRunOptions(args: options.Args, flags: options.Flags): WorkspaceRunOptions {
  let [script, ...scriptArgs] = args;
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    script,
    scriptArgs
  };
}

export async function workspaceRun(opts: WorkspaceRunOptions) {
  let cwd = opts.cwd || process.cwd();
  let project = await Project.init(cwd);
  let workspaces = await project.getWorkspaces();

  await Project.runWorkspaceTasks(workspaces, async workspace => {
    await yarn.run(workspace.pkg, opts.script, opts.scriptArgs);
  });
}
