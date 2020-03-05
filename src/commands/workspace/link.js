// @flow
import * as link from '../link';
import Project from '../../Project';
import * as yarn from '../../utils/yarn';
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';

export type WorkspaceLinkOptions = {|
  cwd?: string,
  pkgName: string,
  packagesToLink?: Array<string>
|};

export function toWorkspacelinkOptions(
  args: options.Args,
  flags: options.Flags
): WorkspaceLinkOptions {
  let [pkgName, ...packagesToLink] = args;
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    pkgName,
    packagesToLink
  };
}

export async function workspacelink(opts: WorkspaceLinkOptions) {
  let cwd = opts.cwd || process.cwd();
  let packagesToLink = opts.packagesToLink;
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
  if (packagesToLink && packagesToLink.length) {
    await link.link(await link.toLinkOptions(packagesToLink, { '--': [] }));
  } else {
    await yarn.cliCommand(pkg.dir, 'link');
  }
}
