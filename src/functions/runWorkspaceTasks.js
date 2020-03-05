// @flow
import Project from '../Project';
import type { FilterOpts, JSONValue, SpawnOpts } from '../types';

type WorkspaceInfo = {
  dir: string,
  config: JSONValue
};

type Task = (workspace: WorkspaceInfo) => Promise<mixed>;

type Options = {
  cwd?: string,
  spawnOpts?: SpawnOpts,
  filterOpts?: FilterOpts
};

export default async function runWorkspaceTasks(
  task: Task,
  opts: Options = {}
): Promise<void> {
  let cwd = opts.cwd || process.cwd();
  let spawnOpts = opts.spawnOpts || {};
  let filterOpts = opts.filterOpts || {};
  let project = await Project.init(cwd);
  let packages = await project.getPackages();
  let filteredPackages = project.filterPackages(packages, filterOpts);

  await project.runPackageTasks(filteredPackages, spawnOpts, pkg => {
    return task({
      dir: pkg.dir,
      config: pkg.config.json
    });
  });
}
