// @flow
import semver from 'semver';
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';
import * as logger from '../utils/logger';
import * as messages from '../utils/messages';
import * as locks from '../utils/locks';
import * as npm from '../utils/npm';
import Project from '../Project';

export type PublishOptions = {|
  cwd?: string,
  access?: string
|};

export function toPublishOptions(
  args: options.Args,
  flags: options.Flags
): PublishOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    access: options.string(flags.access, 'access')
  };
}

async function getUnpublishedPackages(packages) {
  let semverGtCheckFailWithWarning = (
    pkgLocalVersion: string,
    pkgPublishedVersion: string,
    pkgName: string
  ): boolean => {
    let shouldPublish = semver.gt(pkgLocalVersion, pkgPublishedVersion);

    // show a warning message if package is not published since pkgPublishedVersion > pkgLocalVersion
    if (!shouldPublish) {
      logger.warn(
        messages.notPublishingPackage(
          pkgLocalVersion,
          pkgPublishedVersion,
          pkgName
        )
      );
    }

    return shouldPublish;
  };

  let results = await Promise.all(
    packages.map(async pkg => {
      let config = pkg.config;
      let response = await npm.infoAllow404(config.getName());

      return {
        name: config.getName(),
        localVersion: config.getVersion(),
        isPublished: response.published,
        newVersion: response.pkgInfo.version || ''
      };
    })
  );

  return results.filter(result => {
    // only publish if our version is higher than the one on npm
    return (
      !result.isPublished ||
      semverGtCheckFailWithWarning(
        result.localVersion,
        result.newVersion,
        result.name
      )
    );
  });
}

export async function publish(opts: PublishOptions) {
  let cwd = opts.cwd || process.cwd();
  let project = await Project.init(cwd);
  let workspaces = await project.getWorkspaces();
  let packages = workspaces
    .map(workspace => workspace.pkg)
    .filter(pkg => !pkg.config.getPrivate());
  let publishedPackages = [];

  try {
    // TODO: Re-enable once locking issues are sorted out
    // await locks.lock(packages);
    let unpublishedPackages = await getUnpublishedPackages(packages);
    let isUnpublished = workspace =>
      unpublishedPackages.some(
        pkg => workspace.pkg.config.getName() === pkg.name
      );
    let unpublishedWorkspaces = workspaces.filter(isUnpublished);
    if (unpublishedPackages.length === 0) {
      logger.warn(messages.noUnpublishedPackagesToPublish());
    }

    await project.runWorkspaceTasks(unpublishedWorkspaces, async workspace => {
      let name = workspace.pkg.config.getName();
      let version = workspace.pkg.config.getVersion();
      logger.info(messages.publishingPackage(name, version));

      let publishConfirmation = await npm.publish(name, {
        cwd: workspace.pkg.dir,
        access: opts.access
      });

      publishedPackages.push({
        name,
        newVersion: version,
        published: publishConfirmation && publishConfirmation.published
      });
    });

    return publishedPackages;

    // TODO: Re-enable once locking issues are sorted out
    // await locks.unlock(packages);
  } catch (err) {
    logger.error(err.message);
    throw new BoltError('Failed to publish');
  }
}
