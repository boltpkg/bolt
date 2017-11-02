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

export default async function upgradeDependenciesInPackage(
  project: Project,
  pkg: Package,
  dependencies: Array<Dependency>
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
      throw new BoltError();
    }
  }

  await yarn.upgrade(project.pkg, externalDeps);

  // we reinitialise the project config because it may be modified externally by yarn
  const newProject = await Project.init(project.pkg.dir);
  // get the new versions of everything from the project config
  const newProjectDependencies = project.pkg.getAllDependencies();
  const depsToUpgrade = {};

  externalDeps.forEach(dep => {
    // TODO: Should we bother checking if the dep exists in the project? It /should/
    depsToUpgrade[dep.name] = newProjectDependencies.get(dep.name);
  });

  console.log(depsToUpgrade);

  await updatePackageVersions(depsToUpgrade, { cwd: project.pkg.dir });
}
