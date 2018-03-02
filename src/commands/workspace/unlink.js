// @flow
import Project from '../../Project';
import * as yarn from '../../utils/yarn';
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';
import * as messages from '../../utils/messages';

type WorkspaceUnlinkOptions = {|
  cwd?: string,
  workspaceName: string,
  packagesToUnlink?: Array<string>
|};

function toWorkspaceUnlinkOptions(
  args: options.Args,
  flags: options.Flags
): WorkspaceUnlinkOptions {
  const [workspaceName, ...packagesToUnlink] = args;
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    workspaceName,
    packagesToUnlink
  };
}

export async function unlink(
  flags: options.Flags,
  subCommandArgs: Array<string>
) {
  let opts = toWorkspaceUnlinkOptions(subCommandArgs, flags);
  let cwd = opts.cwd || process.cwd();
  let packagesToUnlink = opts.packagesToUnlink;
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
  if (packagesToUnlink && packagesToUnlink.length) {
    await Promise.all(
      packagesToUnlink.map(async packageToUnlink => {
        if (workspaceMap.has(packageToUnlink)) {
          logger.warn(messages.unlinkInternalPackage(packageToUnlink));
        } else {
          await yarn.cliCommand(cwd, 'unlink', [packageToUnlink]);
        }
      })
    );
  } else {
    await yarn.cliCommand(workspace.pkg.dir, 'unlink');
  }
}
