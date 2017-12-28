// @flow

import Project from '../Project';
import Workspace from '../Workspace';
import Package from '../Package';
import DependencyGraph from '../DependencyGraph';
import type { Dependency } from '../types';
import * as messages from './messages';
import { BoltError } from './errors';
import * as logger from './logger';
import * as yarn from './yarn';
import updatePackageVersions from '../functions/updatePackageVersions';
import updateWorkspaceDependencies from '../functions/updateWorkspaceDependencies';

export default async function upgradeDependenciesInPackage(
  project: Project,
  pkg: Package,
  dependencies: Array<Dependency>,
  flags?: Array<string>
) {
  let workspaces = await project.getWorkspaces();
  let pkgDependencies = pkg.getAllDependencies();
  let depGraph = new DependencyGraph(project, workspaces);

  let workspaceDependencies = dependencies.map(dep => {
    return project.getWorkspaceByName(workspaces, dep.name);
  });

  let externalDeps = dependencies.filter(
    dep => !depGraph.getDepsByName(dep.name)
  );

  let internalDeps = dependencies.filter(dep =>
    depGraph.getDepsByName(dep.name)
  );

  let projectDependencies = project.pkg.getAllDependencies();

  if (project.pkg.isSamePackage(pkg)) {
    if (internalDeps.length > 0) {
      let internalDepNames = internalDeps.map(dep => dep.name);
      internalDeps.forEach(dep => {
        logger.error(
          messages.cannotUpgradeWorkspaceDependencyInProject(dep.name)
        );
      });
      throw new BoltError(messages.noNeedToSymlinkInternalDependency());
    }
  }

  await yarn.upgrade(project.pkg, externalDeps, flags);

  // we reinitialise the project config because it may be modified externally by yarn
  let newProject = await Project.init(project.pkg.dir);
  // get the new versions of everything from the project config
  let newProjectDependencies = newProject.pkg.getAllDependencies();
  let depsToUpgrade = {};

  newProjectDependencies.forEach((value, key) => {
    depsToUpgrade[key] = value;
  });

  return await updateWorkspaceDependencies(depsToUpgrade, {
    cwd: project.pkg.dir
  });
}
