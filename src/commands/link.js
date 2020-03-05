// @flow
import Project from '../Project';
import * as yarn from '../utils/yarn';
import * as logger from '../utils/logger';
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';
import * as messages from '../utils/messages';

function getPackageMap(packages) {
  let packageMap = new Map();

  for (let pkg of packages) {
    packageMap.set(pkg.getName(), pkg);
  }

  return packageMap;
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
  let packages = await project.getPackages();
  let packageMap = getPackageMap(packages);

  if (packagesToLink && packagesToLink.length) {
    await Promise.all(
      packagesToLink.map(async packageToLink => {
        if (packageMap.has(packageToLink)) {
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
