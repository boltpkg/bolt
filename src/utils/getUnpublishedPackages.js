// @flow
import Project from '../Project';
import * as npm from './npm';

export default async function getUnpublishedPackages(opts: { cwd?: string } = {}) {
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
