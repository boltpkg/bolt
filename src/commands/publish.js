// @flow
import * as options from '../utils/options';
import {PError} from '../utils/errors';
import * as logger from '../utils/logger';
import * as locks from '../utils/locks';
import * as npm from '../utils/npm';
import Project from '../Project';

export type PublishOptions = {|
  cwd?: string,
|};

export function toPublishOptions(args: options.Args, flags: options.Flags): PublishOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd'),
  };
}

async function getUnpublishedPackages(workspaces) {
  const results = await Promise.all(workspaces.map(async workspace => {
    let config = workspace.pkg.config;
    let packageInfo = await npm.info(config.name);

    return {
      name: packageInfo.name,
      version: packageInfo.version,
      previousVersion: config.version,
    };
  }));

  return results.filter(result => {
    return result.version !== result.previousVersion;
  });
}

export async function publish(opts: PublishOptions) {
  const cwd = opts.cwd || process.cwd();
  const project = await Project.init(cwd);
  const workspaces = await project.getWorkspaces();
  const packages = workspaces.map(workspace => workspace.pkg);

  try {
    await locks.lock(packages);
    const unpublishedPackages = await getUnpublishedPackages(workspaces);
    const isUnpublished = workspace => unpublishedPackages.some(pkg => workspace.pkg.config.name === pkg.name);
    const unpublishedWorkspaces = workspaces.filter(isUnpublished);

    await Project.runWorkspaceTasks(unpublishedWorkspaces, async workspace => {
      const {name, version} = workspace.pkg.config;
      logger.info(`Publishing ${name} at ${version}`);

      await npm.publish(name, { cwd: workspace.pkg.dir });
    });

    await locks.unlock(packages);
  } catch (err) {
    logger.error(err.message);
    throw new PError('Failed to publish');
  }
}
