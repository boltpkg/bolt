// @flow
import Project from '../../Project';
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';
import * as yarn from '../../utils/yarn';
import * as unlink from '../unlink';

function getWorkspaceMap(workspaces) {
  let workspaceMap = new Map();

  for (let workspace of workspaces) {
    workspaceMap.set(workspace.pkg.config.getName(), workspace);
  }

  return workspaceMap;
}

export type LinkOptions = {|
  cwd?: string,
  workspaceName: string,
  packagesToUnlink?: Array<string>
|};

export function toWorkspaceUnlinkOptions(
  args: options.Args,
  flags: options.Flags
): LinkOptions {
  const [workspaceName, ...packagesToUnlink] = args;
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    workspaceName,
    packagesToUnlink
  };
}

export async function workspaceUnlink(opts: LinkOptions) {
  let cwd = opts.cwd || process.cwd();
  let packagesToUnlink = opts.packagesToUnlink;
  let workspaceName = opts.workspaceName;
  let project = await Project.init(cwd);
  let workspaces = await project.getWorkspaces();
  let workspace = await project.getWorkspaceByName(
    workspaces,
    opts.workspaceName
  );
  let workspaceMap = getWorkspaceMap(workspaces);

  // If there are packages to link then we can link then in the Project
  // as dependencies are symlinked
  if (packagesToUnlink && packagesToUnlink.length) {
    await unlink.unlink(
      await unlink.toUnlinkOptions(packagesToUnlink, { '--': [] })
    );
  } else {
    workspace && (await yarn.unlink(workspace.pkg.dir));
  }
}
