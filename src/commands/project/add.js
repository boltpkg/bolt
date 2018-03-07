// @flow
import addDependenciesToPackage from '../../utils/addDependenciesToPackages';
import Project from '../../Project';
import * as options from '../../utils/options';
import * as logger from '../../utils/logger';
import type { Dependency, configDependencyType } from '../../types';
import { DEPENDENCY_TYPE_FLAGS_MAP } from '../../constants';
import { add } from '../add';

export type ProjectAddOptions = {
  cwd?: string,
  deps: Array<Dependency>,
  type: configDependencyType
};

export function toProjectAddOptions(
  args: options.Args,
  flags: options.Flags
): ProjectAddOptions {
  let depsArgs = [];
  let type = 'dependencies';

  // args is each of our dependencies we are adding which may have "@version" parts to them
  args.forEach(dep => {
    depsArgs.push(options.toDependency(dep));
  });

  Object.keys(DEPENDENCY_TYPE_FLAGS_MAP).forEach(depTypeFlag => {
    if (flags[depTypeFlag]) {
      type = DEPENDENCY_TYPE_FLAGS_MAP[depTypeFlag];
      // check if value of dependency flag is a package name and then push to dependency arguments
      if (typeof flags[depTypeFlag] === 'string') {
        depsArgs.push(options.toDependency(flags[depTypeFlag]));
      }
    }
  });

  return {
    cwd: options.string(flags.cwd, 'cwd'),
    deps: depsArgs,
    type
  };
}

export async function projectAdd(opts: ProjectAddOptions) {
  await add(opts);
}
