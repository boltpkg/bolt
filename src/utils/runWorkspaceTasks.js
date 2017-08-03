// @flow
import type Workspace from '../workspace';

type Task = (workspace: Workspace) => Promise<mixed>;

// TODO: Properly sort packages using a topological sort, resolving cycles
// with groups specified in `package.json#pworkspaces`
export default async function runWorkspaceTasks(workspaces: Array<Workspace>, task: Task) {
  let promises = [];

  for (let workspace of workspaces) {
    promises.push(task(workspace));
  }

  await Promise.all(promises);
}
