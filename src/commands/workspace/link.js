// @flow
import Project from '../../Project';
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';
import * as yarn from '../../utils/yarn';
import * as link from '../link';

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
  packagesToLink?: Array<string>
|};

export function toWorkspacelinkOptions(
  args: options.Args,
  flags: options.Flags
): LinkOptions {
  const [workspaceName, ...packagesToLink] = args;
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    workspaceName,
    packagesToLink
  };
}

export async function workspacelink(opts: LinkOptions) {
  let cwd = opts.cwd || process.cwd();
  let packagesToLink = opts.packagesToLink;
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
  if (packagesToLink && packagesToLink.length) {
    await link.link(await link.toLinkOptions(packagesToLink, { '--': [] }));
  } else {
    workspace && (await yarn.link(workspace.pkg.dir));
  }
}
