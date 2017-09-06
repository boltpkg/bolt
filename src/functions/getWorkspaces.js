// @flow
import Project from '../Project';
import type {Config} from '../types';

type Options = {
  cwd?: string,
};

type Packages = Array<{
  dir: string,
  name: string,
  config: Config,
}>;

export default async function getWorkspaces(opts: Options = {}): Promise<Packages> {
  let cwd = opts.cwd || process.cwd();
  let project = await Project.init(cwd);
  let workspaces = await project.getWorkspaces();

  return workspaces.map(workspace => ({
    dir: workspace.pkg.dir,
    name: workspace.pkg.config.name,
    config: workspace.pkg.config,
  }));
}
