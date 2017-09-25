// @flow
import semver from 'semver';
import * as options from '../utils/options';
import { PError } from '../utils/errors';
import * as logger from '../utils/logger';
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
  const results = await Promise.all(
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

  return results.filter(result => {
    // only publish if our version is higher than the one on npm
    return (
      !result.isPublished ||
      semver.gt(result.localVersion, result.publishedVersion)
    );
  });
}

export async function publish(opts: PublishOptions) {
  const cwd = opts.cwd || process.cwd();
  const project = await Project.init(cwd);
  const workspaces = await project.getWorkspaces();
  const packages = workspaces
    .map(workspace => workspace.pkg)
    .filter(pkg => !pkg.config.getPrivate());

  try {
    await locks.lock(packages);
    const unpublishedPackages = await getUnpublishedPackages(packages);
    const isUnpublished = workspace =>
      unpublishedPackages.some(
        pkg => workspace.pkg.config.getName() === pkg.name
      );
    const unpublishedWorkspaces = workspaces.filter(isUnpublished);

    if (unpublishedPackages.length === 0) {
      logger.warn('No unpublished packages to release');
    }

    await Project.runWorkspaceTasks(unpublishedWorkspaces, async workspace => {
      const name = workspace.pkg.config.getName();
      const version = workspace.pkg.config.getVersion();
      logger.info(`Publishing ${name} at ${version}`);

      await npm.publish(name, { cwd: workspace.pkg.dir, access: opts.access });
    });

    await locks.unlock(packages);
  } catch (err) {
    logger.error(err.message);
    throw new PError('Failed to publish');
  }
}
