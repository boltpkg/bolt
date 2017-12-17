// @flow
import Project from '../../Project';
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';
import * as yarn from '../../utils/yarn';

export type LinkOptions = {
  cwd?: string,
  workspaceName: string,
  packageToLink?: string
};

export function toWorkspaceLinkOptions(
  args: options.Args,
  flags: options.Flags
): LinkOptions {
  const [workspaceName, packageToLink] = args;
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    workspaceName,
    packageToLink
  };
}

export async function workspaceLink(opts: LinkOptions) {
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
    await yarn.link(workspace.pkg.dir, opts.packageToLink);
  } catch (error) {
    throw new BoltError(error);
  }
}
