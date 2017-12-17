// @flow
import Project from '../../Project';
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';
import * as yarn from '../../utils/yarn';

export type UnlinkOptions = {
  cwd?: string,
  workspaceName: string,
  packageToUnlink?: string
};

export function toWorkspaceUnlinkOptions(
  args: options.Args,
  flags: options.Flags
): UnlinkOptions {
  const [workspaceName, packageToUnlink] = args;
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    workspaceName,
    packageToUnlink
  };
}

export async function workspaceUnlink(opts: UnlinkOptions) {
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

  try {
    await yarn.unLink(workspace.pkg.dir, opts.packageToUnlink);
  } catch (error) {
    throw new BoltError(error);
  }
}
