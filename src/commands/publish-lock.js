// @flow
import Project from '../Project';
import * as locks from '../utils/locks';

export default async function lock() {
  let cwd = process.cwd();
  let project = await Project.init(cwd);
  let workspaces = await project.getWorkspaces();

  let packages = workspaces.map(workspace => workspace.pkg);

  await locks.lock(packages);
}
