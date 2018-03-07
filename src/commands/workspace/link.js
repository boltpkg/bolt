// @flow
import * as link from '../link';
import Project from '../../Project';
import * as yarn from '../../utils/yarn';
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';

export type WorkspaceLinkOptions = {|
  cwd?: string,
  workspaceName: string,
  packagesToLink?: Array<string>
|};

export function toWorkspacelinkOptions(
  args: options.Args,
  flags: options.Flags
): WorkspaceLinkOptions {
  let [workspaceName, ...packagesToLink] = args;
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    workspaceName,
    packagesToLink
  };
}

export async function workspacelink(opts: WorkspaceLinkOptions) {
  let cwd = opts.cwd || process.cwd();
  let packagesToLink = opts.packagesToLink;
  let workspaceName = opts.workspaceName;
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

  // If there are packages to link then we can link then in the Project
  // as dependencies are symlinked
  if (packagesToLink && packagesToLink.length) {
    await link.link(await link.toLinkOptions(packagesToLink, { '--': [] }));
  } else {
    await yarn.cliCommand(workspace.pkg.dir, 'link');
  }
}
