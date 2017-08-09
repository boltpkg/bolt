// @flow
import type {Args, Opts} from '../../types';
import Project from '../../Project';

export default async function run(args: Args, opts: Opts) {
  let cwd = process.cwd();
  let project = await Project.init(cwd);
  let workspaces = await project.getWorkspaces();

  let [cmd, ...restArgs] = args;

  await Project.runWorkspaceTasks(workspaces, async workspace => {
    await workspace.pkg.runScript(cmd, restArgs);
  });
}
