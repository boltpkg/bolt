// @flow
import type {Args, Opts} from '../../types';
import Project from '../../Project';
import * as yarn from '../../utils/yarn';
import filterWorkspaces from '../../utils/filterWorkspace';

export default async function run(args: Args, opts: Opts) {
  let cwd = process.cwd();
  let project = await Project.init(cwd);
  let workspaces = await project.getWorkspaces();
  let filteredWorkspaces = filterWorkspaces(workspaces, opts);

  let [cmd, ...restArgs] = args;

  await Project.runWorkspaceTasks(filteredWorkspaces, async workspace => {
    await yarn.run(workspace.pkg, cmd, restArgs);
  });
}
