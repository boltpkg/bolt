// @flow
import Project from '../Project';
import type { JSONValue, SpawnOpts } from '../types';

type WorkspaceInfo = {
  dir: string,
  config: JSONValue
};

type Task = (workspace: WorkspaceInfo) => Promise<mixed>;

type Options = {
  cwd?: string,
  spawnOpts?: SpawnOpts
};

export default async function runWorkspaceTasks(
  task: Task,
  opts: Options = {}
): Promise<void> {
  let cwd = opts.cwd || process.cwd();
  let spawnOpts = opts.spawnOpts || {};
  let project = await Project.init(cwd);
  let packages = await project.getPackages();

  await project.runPackageTasks(packages, spawnOpts, pkg => {
    return task({
      dir: pkg.dir,
      config: pkg.config.json
    });
  });
}
