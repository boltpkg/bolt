// @flow
import * as path from 'path';
import Project from '../Project';
import type { JSONValue } from '../types';

type Options = {
  cwd?: string
};

type Package = {
  dir: string,
  name: string,
  config: JSONValue
};

export default async function getProject(opts: Options = {}): Promise<Package> {
  let cwd = opts.cwd || process.cwd();
  let project = await Project.init(cwd);

  return {
    dir: project.pkg.dir,
    name: project.pkg.config.getName(),
    config: project.pkg.config.json
  };
}
