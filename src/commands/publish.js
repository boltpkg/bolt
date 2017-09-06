// @flow
import type {Args, Opts} from '../types';
import {PError} from '../utils/errors';
import * as logger from '../utils/logger';
import * as locks from '../utils/locks';
import * as npm from '../utils/npm';
import Project from '../Project';

async function getUnpublishedPackages(opts: { cwd?: string } = {}) {
  const cwd = opts.cwd || process.cwd();
  const project = await Project.init(cwd);
  const workspaces = await project.getWorkspaces();

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

export default async function publish(args: Args, opts: Opts) {
  const cwd = typeof opts.cwd === 'string' ? opts.cwd : process.cwd();
  const project = await Project.init(cwd);
  const workspaces = await project.getWorkspaces();
  const packages = workspaces.map(workspace => workspace.pkg);

  try {
    await locks.lock(packages);
    const unpublishedPackages = await getUnpublishedPackages({ cwd });
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
