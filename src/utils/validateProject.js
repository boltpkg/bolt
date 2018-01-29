// @flow
import semver from 'semver';
import Project from '../Project';
import Config from '../Config';
import type Workspace from '../Workspace';
import type Package from '../Package';
import * as messages from './messages';
import { BoltError } from './errors';
import * as logger from './logger';
import { BOLT_VERSION } from '../constants';

export default async function validateProject(project: Project) {
  const workspaces = await project.getWorkspaces();
  const projectDependencies = project.pkg.getAllDependencies();
  const projectConfig = project.pkg.config;
  const { graph: depGraph } = await project.getDependencyGraph(workspaces);

  let projectIsValid = true;
  let invalidMessages = [];

  // If the project has an engines.bolt field we must respect it
  const boltConfigVersion = projectConfig.getBoltConfigVersion();
  if (boltConfigVersion) {
    if (!semver.satisfies(BOLT_VERSION, boltConfigVersion)) {
      invalidMessages.push(
        messages.invalidBoltVersion(BOLT_VERSION, boltConfigVersion)
      );
      projectIsValid = false;
    }
  }

  // Workspaces should never appear as dependencies in the Project config
  for (let workspace of workspaces) {
    const depName = workspace.pkg.config.getName();
    if (projectDependencies.has(depName)) {
      invalidMessages.push(messages.projectCannotDependOnWorkspace(depName));
      projectIsValid = false;
    }
  }

  /**
   *     <More Project checks here>
   */

  return {
    invalidMessages,
    projectIsValid
  };
}
