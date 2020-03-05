// @flow
import Project from '../../Project';
import Package from '../../Package';
import * as options from '../../utils/options';
import * as logger from '../../utils/logger';
import addDependenciesToPackage from '../../utils/addDependenciesToPackages';
import { BoltError } from '../../utils/errors';
import type { Dependency, configDependencyType } from '../../types';
import { DEPENDENCY_TYPE_FLAGS_MAP } from '../../constants';

export type WorkspaceAddOptions = {
  cwd?: string,
  pkgName: string,
  deps: Array<Dependency>,
  type: configDependencyType
};

export function toWorkspaceAddOptions(
  args: options.Args,
  flags: options.Flags
): WorkspaceAddOptions {
  let [pkgName, ...deps] = args;
  let depsArgs = [];
  let type = 'dependencies';

  deps.forEach(dep => {
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
    pkgName,
    deps: depsArgs,
    type
  };
}

export async function workspaceAdd(opts: WorkspaceAddOptions) {
  let cwd = opts.cwd || process.cwd();
  let project = await Project.init(cwd);
  let packages = await project.getPackages();
  let pkg = await project.getPackageByName(packages, opts.pkgName);

  if (!pkg) {
    throw new BoltError(
      `Could not find a workspace named "${opts.pkgName}" from "${cwd}"`
    );
  }

  await addDependenciesToPackage(project, pkg, opts.deps, opts.type);
}
