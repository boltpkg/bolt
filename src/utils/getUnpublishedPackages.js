// @flow
import Project from '../Project';
import * as npm from './npm';

export default async function getUnpublishedPackages(opts: { cwd?: string } = {}) {
  const cwd = opts.cwd || process.cwd();
  const project = await Project.init(cwd);
  const workspaces = await project.getWorkspaces();
  const unpublishedPackages = [];

  for (let workspace of workspaces) {
    const packageInfo = await npm.info(workspace.pkg.config.name);

    if (packageInfo.version !== workspace.pkg.config.version) {
      unpublishedPackages.push({
        name: packageInfo.name,
        version: packageInfo.version,
        previousVersion: workspace.pkg.config.version,
      });
    }
  }

  return unpublishedPackages;
}
