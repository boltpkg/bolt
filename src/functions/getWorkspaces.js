// @flow
import Project from '../Project';
import type { JSONValue } from '../types';

type Options = {
  cwd?: string
};

type Packages = Array<{
  dir: string,
  name: string,
  config: JSONValue
}>;

export default async function getWorkspaces(
  opts: Options = {}
): Promise<Packages> {
  let cwd = opts.cwd || process.cwd();
  let project = await Project.init(cwd);
  let packages = await project.getPackages();

  return packages.map(pkg => ({
    dir: pkg.dir,
    name: pkg.getName(),
    config: pkg.config.json
  }));
}
