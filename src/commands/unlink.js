// @flow
import Project from '../Project';
import * as yarn from '../utils/yarn';
import * as logger from '../utils/logger';
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';
import * as messages from '../utils/messages';

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
        logger.warn(messages.unlinkInternalPackage(packageToUnlink));
      } else {
        await yarn.unlink(cwd, packageToUnlink);
      }
    });
  } else {
    throw new BoltError(
      'Please specify package to unlink. Try: bolt w [packageToUnlink] unlink'
    );
  }
}
