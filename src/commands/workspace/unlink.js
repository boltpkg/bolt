// @flow
import * as unlink from '../unlink';
import Project from '../../Project';
import * as yarn from '../../utils/yarn';
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';

export type WorkspaceUnlinkOptions = {|
  cwd?: string,
  pkgName: string,
  packagesToUnlink?: Array<string>
|};

export function toWorkspaceUnlinkOptions(
  args: options.Args,
  flags: options.Flags
): WorkspaceUnlinkOptions {
  let [pkgName, ...packagesToUnlink] = args;
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    pkgName,
    packagesToUnlink
  };
}

export async function workspaceUnlink(opts: WorkspaceUnlinkOptions) {
  let cwd = opts.cwd || process.cwd();
  let packagesToUnlink = opts.packagesToUnlink;
  let pkgName = opts.pkgName;
  let project = await Project.init(cwd);
  let packages = await project.getPackages();
  let pkg = await project.getPackageByName(packages, opts.pkgName);

  if (!pkg) {
    throw new BoltError(
      `Could not find a workspace named "${opts.pkgName}" from "${cwd}"`
    );
  }

  // If there are packages to link then we can link then in the Project
  // as dependencies are symlinked
  if (packagesToUnlink && packagesToUnlink.length) {
    await unlink.unlink(
      await unlink.toUnlinkOptions(packagesToUnlink, { '--': [] })
    );
  } else {
    await yarn.cliCommand(pkg.dir, 'unlink');
  }
}
