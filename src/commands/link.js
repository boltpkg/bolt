// @flow
import Project from '../Project';
import * as yarn from '../utils/yarn';
import * as logger from '../utils/logger';
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';
import * as messages from '../utils/messages';

function getWorkspaceMap(workspaces) {
  let workspaceMap = new Map();

  for (let workspace of workspaces) {
    workspaceMap.set(workspace.pkg.config.getName(), workspace);
  }

  return workspaceMap;
}

type LinkOptions = {|
  cwd?: string,
  packagesToLink: ?Array<string>
|};

function toLinkOptions(args: options.Args, flags: options.Flags): LinkOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    packagesToLink: args
  };
}

export async function link(flags: options.Flags, commandArgs: Array<string>) {
  let opts = toLinkOptions(commandArgs, flags);
  let cwd = opts.cwd || process.cwd();
  let packagesToLink = opts.packagesToLink;
  let project = await Project.init(cwd);
  let workspaces = await project.getWorkspaces();
  let workspaceMap = getWorkspaceMap(workspaces);

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
    throw new BoltError(
      `Cannot create a link to entire workspace. Please specify package to link.`
    );
  }
}
