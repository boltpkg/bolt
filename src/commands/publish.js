// @flow
import semver from 'semver';
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';
import * as logger from '../utils/logger';
import * as messages from '../utils/messages';
import * as locks from '../utils/locks';
import * as npm from '../utils/npm';
import Project from '../Project';
import Package from '../Package';

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
  let results = await Promise.all(
    packages.map(async pkg => {
      let config = pkg.config;
      let response = await npm.infoAllow404(config.getName());

      return {
        name: config.getName(),
        localVersion: config.getVersion(),
        isPublished: response.published,
        publishedVersion: response.pkgInfo.version || ''
      };
    })
  );

  let packagesToPublish = [];

  for (let pkgInfo of results) {
    let { name, isPublished, localVersion, publishedVersion } = pkgInfo;
    if (!isPublished) {
      packagesToPublish.push(pkgInfo);
    } else if (semver.gt(localVersion, publishedVersion)) {
      packagesToPublish.push(pkgInfo);
      logger.info(
        messages.willPublishPackage(localVersion, publishedVersion, name)
      );
    } else if (semver.lt(localVersion, publishedVersion)) {
      // If the local version is behind npm, something is wrong, we warn here, and by not getting published later, it will fail
      logger.warn(
        messages.willNotPublishPackage(localVersion, publishedVersion, name)
      );
    }
  }

  return packagesToPublish;
}

export async function publish(opts: PublishOptions) {
  let cwd = opts.cwd || process.cwd();
  let project = await Project.init(cwd);
  let packages = await project.getPackages();
  let publicPackages = packages.filter(pkg => !pkg.config.getPrivate());
  let publishedPackages = [];

  try {
    // TODO: Re-enable once locking issues are sorted out
    // await locks.lock(packages);
    let unpublishedPackagesInfo = await getUnpublishedPackages(publicPackages);
    let unpublishedPackages = publicPackages.filter(pkg => {
      return unpublishedPackagesInfo.some(p => pkg.getName() === p.name);
    });

    if (unpublishedPackagesInfo.length === 0) {
      logger.warn(messages.noUnpublishedPackagesToPublish());
    }

    await project.runPackageTasks(unpublishedPackages, async pkg => {
      let name = pkg.config.getName();
      let version = pkg.config.getVersion();
      logger.info(messages.publishingPackage(name, version));

      let publishConfirmation = await npm.publish(name, {
        cwd: pkg.dir,
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
