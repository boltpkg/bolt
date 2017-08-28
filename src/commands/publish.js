// @flow
import type {Args, Opts} from '../types';
import {PError} from '../utils/errors';
import * as logger from '../utils/logger';
import * as locks from '../utils/locks';
import getUnpublishedPackages from '../utils/getUnpublishedPackages';
import Project from '../Project';
import * as npm from '../utils/npm';
import * as yarn from '../utils/yarn';


export default async function publish(args: Args, opts: Opts) {
  const cwd = process.cwd();
  const project = await Project.init(cwd);
  const workspaces = await project.getWorkspaces();
  const packages = workspaces.map(workspace => workspace.pkg);

  try {
    await locks.lock(packages);
    const unpublishedPackages = await getUnpublishedPackages(opts);
    const isUnpublished = workspace => unpublishedPackages.some(pkg => workspace.pkg.config.name === pkg.name);
    const unpublishedWorkspaces = workspaces.filter(isUnpublished);

    await Project.runWorkspaceTasks(unpublishedWorkspaces, async workspace => {
      const {name, version} = workspace.pkg.config;
      logger.info(`Publishing ${name} at ${version}`);

      await npm.publish(workspace.pkg.config.name, { cwd: workspace.pkg.dir });
    });

    await locks.unlock(packages);

  } catch (err) {
    logger.error(err.message);
    throw new PError('Failed to publish');
  }
}
