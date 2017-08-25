// @flow
import type {Task} from '../Project';
import Project from '../Project';

export default async function runWorkspaceTasks(task: Task, opts: { cwd?: string } = {}) {
  let cwd = opts.cwd || process.cwd();
  let project = await Project.init(cwd);
  let workspaces = await project.getWorkspaces();
  await Project.runWorkspaceTasks(workspaces, task);
}
