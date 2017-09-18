// @flow
import * as options from '../../utils/options';
import Project from '../../Project';
import * as yarn from '../../utils/yarn';

export type WorkspacesRunOptions = {
  cwd?: string,
  script: string,
  scriptArgs: options.Args,
};

export function toWorkspacesRunOptions(args: options.Args, flags: options.Flags): WorkspacesRunOptions {
  let [script, ...scriptArgs] = args;
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    script,
    scriptArgs
  };
}

export async function workspacesRun(opts: WorkspacesRunOptions) {
  let cwd = opts.cwd || process.cwd();
  let project = await Project.init(cwd);
  let workspaces = await project.getWorkspaces();

  await Project.runWorkspaceTasks(workspaces, async workspace => {
    await yarn.run(workspace.pkg, opts.script, opts.scriptArgs);
  });
}
