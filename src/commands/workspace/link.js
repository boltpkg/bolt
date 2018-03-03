// @flow
import Project from '../../Project';
import * as yarn from '../../utils/yarn';
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';
import * as messages from '../../utils/messages';

function getWorkspaceMap(workspaces) {
  let workspaceMap = new Map();

  for (let workspace of workspaces) {
    workspaceMap.set(workspace.pkg.config.getName(), workspace);
  }

  return workspaceMap;
}

type WorkspaceLinkOptions = {|
  cwd?: string,
  workspaceName: string,
  packagesToLink?: Array<string>
|};

function toWorkspacelinkOptions(
  args: options.Args,
  flags: options.Flags
): WorkspaceLinkOptions {
  const [workspaceName, ...packagesToLink] = args;
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    workspaceName,
    packagesToLink
  };
}

export async function workspaceLink(
  flags: options.Flags,
  subCommandArgs: Array<string>
) {
  let opts = toWorkspacelinkOptions(subCommandArgs, flags);
  let cwd = opts.cwd || process.cwd();
  let packagesToLink = opts.packagesToLink;
  let workspaceName = opts.workspaceName;
  let project = await Project.init(cwd);
  let workspaces = await project.getWorkspaces();
  let workspaceMap = getWorkspaceMap(workspaces);
  let workspace = await project.getWorkspaceByName(
    workspaces,
    opts.workspaceName
  );

  if (!workspace) {
    throw new BoltError(
      `Could not find a workspace named "${opts.workspaceName}" from "${cwd}"`
    );
  }

  if (packagesToLink && packagesToLink.length) {
    await Promise.all(
      packagesToLink.map(async packageToLink => {
        if (workspaceMap.has(packageToLink)) {
          logger.warn(messages.linkInternalPackage(packageToLink));
        } else {
          await yarn.cliCommand(cwd, 'link', [packageToLink]);
        }
      })
    );
  } else {
    await yarn.cliCommand(workspace.pkg.dir, 'link');
  }
}
