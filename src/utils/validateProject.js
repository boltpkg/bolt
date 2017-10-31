// @flow

import Project from '../Project';
import type Workspace from '../Workspace';
import type Package from '../Package';
import * as messages from './messages';
import { BoltError } from './errors';
import * as logger from './logger';

export default async function validateProject(project: Project) {
  const workspaces = await project.getWorkspaces();
  const projectDependencies = project.pkg.getAllDependencies();
  const { graph: depGraph } = await project.getDependencyGraph(workspaces);

  let projectIsValid = true;

  // Workspaces should never appear as dependencies in the Project config
  for (let workspace of workspaces) {
    const depName = workspace.pkg.config.getName();
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
