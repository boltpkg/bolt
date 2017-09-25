// @flow

import Project from '../Project';
import type Workspace from '../Workspace';
import type Package from '../Package';
import type { Dependency, configDependencyType } from '../types';
import * as messages from './messages';
import * as logger from './logger';
import * as yarn from './yarn';
import symlinkPackageDependencies from './symlinkPackageDependencies';

export default async function addDependenciesToPackage(
  project: Project,
  pkg: Package,
  dependencies: Array<Dependency>,
  type?: configDependencyType = 'dependencies'
) {
  const workspaces = await project.getWorkspaces();
  const projectDependencies = project.pkg.getAllDependencies();
  const pkgDependencies = pkg.getAllDependencies();
  const { graph: depGraph } = await project.getDependencyGraph(workspaces);

  const dependencyNames = dependencies.map(dep => dep.name);
  const externalDeps = dependencies.filter(dep => !depGraph.has(dep.name));
  const internalDeps = dependencies.filter(dep => depGraph.has(dep.name));

  const externalDepsToInstallForProject = externalDeps.filter(
    dep => !projectDependencies.has(dep.name)
  );
  await yarn.add(project.pkg, externalDepsToInstallForProject, type);

  if (pkg.isSamePackage(project.pkg)) {
    return true;
  }

  const installedVersions = {};

  for (let dep of externalDeps) {
    const installed = project.pkg.getDependencyVersionRange(dep.name);
    if (dep.version && dep.version !== installed) {
      logger.warn(
        messages.depMustMatchProject(
          pkg.config.name,
          dep.name,
          installed,
          dep.version
        )
      );
      throw new Error();
    }
    installedVersions[dep.name] = String(installed);
  }

  for (let dep of internalDeps) {
    const dependencyPkg = (depGraph.get(dep.name) || {}).pkg;
    const curVersion = dependencyPkg.config.version;
    if (dep.version) {
      logger.warn(
        messages.packageMustDependOnCurrentVersion(
          pkg.config.name,
          dep.name,
          curVersion,
          dep.version
        )
      );
      throw new Error();
    }
    installedVersions[dep.name] = `^${curVersion}`;
  }

  for (let [depName, depVersion] of Object.entries(installedVersions)) {
    await pkg.setDependencyVersionRange(depName, type, depVersion);
  }

  await symlinkPackageDependencies(project, pkg, dependencyNames);
}
