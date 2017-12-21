// @flow
import * as options from '../utils/options';
import * as yarn from '../utils/yarn';
import { BoltError } from '../utils/errors';
import Project from '../Project';

function getWorkspaceMap(workspaces) {
  let workspaceMap = new Map();

  for (let workspace of workspaces) {
    workspaceMap.set(workspace.pkg.config.getName(), workspace);
  }

  return workspaceMap;
}

export type LinkOptions = {|
  cwd?: string,
  packagesToLink: ?Array<string>
|};

export function toLinkOptions(
  args: options.Args,
  flags: options.Flags
): LinkOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    packagesToLink: args
  };
}

export async function link(opts: LinkOptions) {
  let cwd = opts.cwd || process.cwd();
  let packagesToLink = opts.packagesToLink;
  let project = await Project.init(cwd);
  let workspaces = await project.getWorkspaces();
  let workspaceMap = getWorkspaceMap(workspaces);

  if (packagesToLink && packagesToLink.length) {
    packagesToLink.forEach(async packageToLink => {
      if (workspaceMap.has(packageToLink)) {
        throw new BoltError(
          `There is a workspace by the name ${packageToLink} already linked`
        );
      }

      await yarn.link(cwd, packageToLink);
    });
  } else {
    throw new BoltError(`Need to pass project that needs to be linked`);
  }
}
