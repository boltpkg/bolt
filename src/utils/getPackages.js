// @flow
import Project from '../Project';

export default async function getPackages(opts: { cwd?: string } = {}) {
  let cwd = opts.cwd || process.cwd();
  let project = await Project.init(cwd);
  let workspaces = await project.getWorkspaces();

  return workspaces.map(workspace => ({
    dir: workspace.pkg.dir,
    name: workspace.pkg.config.name,
    config: workspace.pkg.config,
  }));
}
