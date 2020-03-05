// @flow
import semver from 'semver';
import Project from '../Project';
import Config from '../Config';
import Package from '../Package';
import * as messages from './messages';
import { BoltError } from './errors';
import * as logger from './logger';
import { BOLT_VERSION } from '../constants';

export default async function validateProject(project: Project) {
  let packages = await project.getPackages();
  let projectDependencies = project.pkg.getAllDependencies();
  let projectConfig = project.pkg.config;
  let { graph: depGraph } = await project.getDependencyGraph(packages);

  let projectIsValid = true;

  // If the project has an engines.bolt field we must respect it
  let boltConfigVersion = projectConfig.getBoltConfigVersion();
  if (boltConfigVersion) {
    if (!semver.satisfies(BOLT_VERSION, boltConfigVersion)) {
      logger.error(
        messages.invalidBoltVersion(BOLT_VERSION, boltConfigVersion)
      );
      projectIsValid = false;
    }
  }

  // Workspaces always have a name and a version in their configs
  for (let pkg of packages) {
    try {
      pkg.getName();
    } catch (err) {
      logger.error(err.message);
      projectIsValid = false;
    }

    try {
      pkg.getVersion();
    } catch (err) {
      logger.error(err.message);
      projectIsValid = false;
    }
  }

  // Workspaces should never appear as dependencies in the Project config
  for (let pkg of packages) {
    let depName = pkg.getName();
    if (projectDependencies.has(depName)) {
      logger.error(messages.projectCannotDependOnWorkspace(depName));
      projectIsValid = false;
    }
  }

  /**
   *     <More Project checks here>
   */

  return projectIsValid;
}
