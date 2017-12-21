// @flow
import * as options from '../utils/options';
import * as yarn from '../utils/yarn';
import { BoltError } from '../utils/errors';
import Project from '../Project';

function getWorkspaceMap(workspaces) {
  let workspaceMap = new Map();

  for (let workspace of workspaces) {
    workspaceMap.set(workspace.pkg.config.getName(), workspace);
  }

  return workspaceMap;
}

export type UnlinkOptions = {
  cwd?: string,
  packagesToUnlink: ?Array<string>
};

export function toUnlinkOptions(
  args: options.Args,
  flags: options.Flags
): UnlinkOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    packagesToUnlink: args
  };
}

export async function unlink(opts: UnlinkOptions) {
  let cwd = opts.cwd || process.cwd();
  let packagesToUnlink = opts.packagesToUnlink;
  let project = await Project.init(cwd);
  let workspaces = await project.getWorkspaces();
  let workspaceMap = getWorkspaceMap(workspaces);

  // guard to check if there are packages to unlink
  if (packagesToUnlink && packagesToUnlink.length) {
    packagesToUnlink.forEach(async packageToUnlink => {
      if (workspaceMap.has(packageToUnlink)) {
        throw new BoltError(`Cannot unlink a workspace`);
      }

      await yarn.unlink(cwd, packageToUnlink);
    });
  } else {
    throw new BoltError('Need to tell which package to unlink');
  }
}
