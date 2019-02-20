// @flow
import Project from '../Project';
import type { JSONValue } from '../types';
import * as options from '../utils/options';

type Options = {
  cwd?: string,
  only?: Array<string> | string,
  ignore?: Array<string> | string,
  onlyFs?: Array<string> | string,
  ignoreFs?: Array<string> | string
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

  let filtered = project.filterPackages(packages, options.toFilterOpts({
    only: opts.only,
    ignore: opts.ignore,
    onlyFs: opts.onlyFs,
    ignoreFs: opts.ignoreFs
  }));

  return filtered.map(pkg => ({
    dir: pkg.dir,
    name: pkg.getName(),
    config: pkg.config.json
  }));
}
