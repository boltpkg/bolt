// @flow
import * as logger from '../utils/logger';
import * as options from '../utils/options';
import * as yarn from '../utils/yarn';
import { PError } from '../utils/errors';
import Project from '../Project';

export type AddOptions = {
  pkgs: Array<string>,
  cwd?: string,
  dev?: boolean
};

export function toAddOptions(
  args: options.Args,
  flags: options.Flags
): AddOptions {
  return {
    pkgs: args,
    cwd: options.string(flags.cwd, 'cwd'),
    dev: options.boolean(flags.dev, 'dev')
  };
}

function getProjectDependencyVersion(project, depName) {
  const depTypeInProject = project.pkg.getDependencyType(depName);

  return (
    depTypeInProject &&
    project.pkg.config[depTypeInProject] &&
    project.pkg.config[depTypeInProject][depName]
  );
}

export async function add(opts: AddOptions) {
  const cwd = opts.cwd || process.cwd();
  let project = await Project.init(cwd);
  let workspaces = await project.getWorkspaces();
  const pConfig = project.pkg.config;
  const depType = opts.dev ? 'devDependencies' : 'dependencies';

  // Firstly install all packages in the project (already installed packages will be quick)
  await yarn.add(project.pkg, opts.pkgs);

  // Need to re-init the project to get an up to date config
  project = await Project.init(cwd);
  workspaces = await project.getWorkspaces();

  if (cwd === project.pkg.dir) return;

  const workspaceToRunIn =
    workspaces.find(workspace => workspace.pkg.dir === cwd) || {};

  for (let pkg of opts.pkgs) {
    const installedVersion = String(getProjectDependencyVersion(project, pkg));

    await workspaceToRunIn.pkg.setDependencyVersionRange(
      pkg,
      depType,
      installedVersion
    );
  }
}
