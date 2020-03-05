// @flow
import Project from '../Project';
import type { JSONValue } from '../types';

type Options = {
  cwd?: string,
  only?: string,
  ignore?: string,
  onlyFs?: string,
  ignoreFs?: string
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

  let filtered = project.filterPackages(packages, {
    only: opts.only,
    ignore: opts.ignore,
    onlyFs: opts.onlyFs,
    ignoreFs: opts.ignoreFs
  });

  return filtered.map(pkg => ({
    dir: pkg.dir,
    name: pkg.getName(),
    config: pkg.config.json
  }));
}
