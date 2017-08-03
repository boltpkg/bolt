// @flow
import type {Args, Opts} from '../../types';
import runWorkspaceTasks from '../../utils/runWorkspaceTasks';
import runWorkspaceScript from '../../utils/runWorkspaceScript';
import Project from '../../Project';

export default async function run(args: Args, opts: Opts) {
  let cwd = process.cwd();
  let project = await Project.init(cwd);
  let workspaces = await project.getWorkspaces();

  let [cmd, ...restArgs] = args;

  await runWorkspaceTasks(workspaces, async workspace => {
    await runWorkspaceScript(workspace, cmd, restArgs);
  });
}
