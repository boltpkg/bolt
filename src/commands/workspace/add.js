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
  workspaceName: string,
  deps: Array<Dependency>,
  type: configDependencyType
};

export function toWorkspaceAddOptions(
  args: options.Args,
  flags: options.Flags
): WorkspaceAddOptions {
  let [workspaceName, ...deps] = args;
  const depsArgs = [];
  let type = 'dependencies';

  deps.forEach(dep => {
    depsArgs.push(options.toDependency(dep));
  });

  Object.keys(DEPENDENCY_TYPE_FLAGS_MAP).forEach(depTypeFlag => {
    if (flags[depTypeFlag]) {
      type = DEPENDENCY_TYPE_FLAGS_MAP[depTypeFlag];
    }
  });

  return {
    cwd: options.string(flags.cwd, 'cwd'),
    workspaceName,
    deps: depsArgs,
    type
  };
}

export async function workspaceAdd(opts: WorkspaceAddOptions) {
  let cwd = opts.cwd || process.cwd();
  let project = await Project.init(cwd);
  let workspaces = await project.getWorkspaces();
  let workspace = await project.getWorkspaceByName(
    workspaces,
    opts.workspaceName
  );

  if (!workspace) {
    throw new BoltError(
      `Could not find a workspace named "${opts.workspaceName}" from "${cwd}"`
    );
  }

  await addDependenciesToPackage(project, workspace.pkg, opts.deps, opts.type);
}
