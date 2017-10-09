// @flow
import Project from '../Project';
import Package from '../Package';
import * as options from '../utils/options';
import * as logger from '../utils/logger';
import addDependenciesToPackage from '../utils/addDependenciesToPackages';
import type { Dependency, configDependencyType } from '../types';
import { DEPENDENCY_TYPE_FLAGS_MAP } from '../constants';

export type AddOptions = {
  cwd?: string,
  deps: Array<Dependency>,
  type: configDependencyType
};

export function toAddOptions(
  args: options.Args,
  flags: options.Flags
): AddOptions {
  const depsArgs = [];
  let type = 'dependencies';

  // args is each of our dependencies we are adding
  args.forEach(dep => {
    const [name, version] = dep.split('@');
    depsArgs.push(version ? { name, version } : { name });
  });

  Object.keys(DEPENDENCY_TYPE_FLAGS_MAP).forEach(depTypeFlag => {
    if (flags[depTypeFlag]) {
      type = DEPENDENCY_TYPE_FLAGS_MAP[depTypeFlag];
    }
  });

  return {
    cwd: options.string(flags.cwd, 'cwd'),
    deps: depsArgs,
    type
  };
}

export async function add(opts: AddOptions) {
  let cwd = opts.cwd || process.cwd();
  let project = await Project.init(cwd);
  let pkg = await Package.closest(cwd);

  await addDependenciesToPackage(project, pkg, opts.deps, opts.type);
}
