// @flow

import Project from '../Project';
import type Workspace from '../Workspace';
import type Package from '../Package';
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
  flags: Array<string>
) {
  const workspaces = await project.getWorkspaces();
  const pkgDependencies = pkg.getAllDependencies();
  const { graph: depGraph } = await project.getDependencyGraph(workspaces);

  const externalDeps = dependencies.filter(dep => !depGraph.has(dep.name));
  const internalDeps = dependencies.filter(dep => depGraph.has(dep.name));
  const projectDependencies = project.pkg.getAllDependencies();

  if (project.pkg.isSamePackage(pkg)) {
    if (internalDeps.length > 0) {
      const internalDepNames = internalDeps.map(dep => dep.name);
      internalDeps.forEach(dep => {
        logger.error(
          messages.cannotUpgradeWorkspaceDependencyInProject(dep.name)
        );
      });
      throw new BoltError(
        'Internal packages are symlinked, there is no need update them'
      );
    }
  }

  await yarn.upgrade(project.pkg, externalDeps, flags);

  // we reinitialise the project config because it may be modified externally by yarn
  const newProject = await Project.init(project.pkg.dir);
  // get the new versions of everything from the project config
  const newProjectDependencies = newProject.pkg.getAllDependencies();
  const depsToUpgrade = {};

  newProjectDependencies.forEach((value, key) => {
    depsToUpgrade[key] = value;
  });

  return await updateWorkspaceDependencies(depsToUpgrade, {
    cwd: project.pkg.dir
  });
}
