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

export type UnlinkOptions = {
  cwd?: string,
  packagesToUnlink: ?Array<string>
};

export function toUnlinkOptions(
  args: options.Args,
  flags: options.Flags
): UnlinkOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    packagesToUnlink: args
  };
}

export async function unlink(opts: UnlinkOptions) {
  let cwd = opts.cwd || process.cwd();
  let packagesToUnlink = opts.packagesToUnlink;
  let project = await Project.init(cwd);
  let packages = await project.getPackages();
  let packageMap = getPackageMap(packages);

  // guard to check if there are packages to unlink
  if (packagesToUnlink && packagesToUnlink.length) {
    await Promise.all(
      packagesToUnlink.map(async packageToUnlink => {
        if (packageMap.has(packageToUnlink)) {
          logger.warn(messages.unlinkInternalPackage(packageToUnlink));
        } else {
          await yarn.cliCommand(cwd, 'unlink', [packageToUnlink]);
        }
      })
    );
  } else {
    throw new BoltError(
      'Please specify package to unlink. Try: bolt w [packageToUnlink] unlink'
    );
  }
}
