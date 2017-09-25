// @flow
import Project from '../Project';
import type { Config } from '../types';

type WorkspaceInfo = {
  dir: string,
  config: Config
};

type Task = (workspace: WorkspaceInfo) => Promise<mixed>;

type Options = {
  cwd?: string
};

export default async function runWorkspaceTasks(
  task: Task,
  opts: Options = {}
): Promise<void> {
  let cwd = opts.cwd || process.cwd();
  let project = await Project.init(cwd);
  let workspaces = await project.getWorkspaces();

  await Project.runWorkspaceTasks(workspaces, workspace => {
    return task({
      dir: workspace.pkg.dir,
      config: workspace.pkg.config
    });
  });
}
