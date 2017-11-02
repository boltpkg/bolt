// @flow

import semver from 'semver';

import Project from '../Project';
import type Workspace from '../Workspace';
import type Package from '../Package';
import type { Dependency, configDependencyType } from '../types';
import * as messages from './messages';
import { BoltError } from './errors';
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
  if (externalDepsToInstallForProject.length !== 0) {
    await yarn.add(project.pkg, externalDepsToInstallForProject, type);
    // we reinitialise the project config because it will be modified externally by yarn
    project = await Project.init(project.pkg.dir);
  }

  if (pkg.isSamePackage(project.pkg)) {
    if (internalDeps.length > 0) {
      throw new BoltError(
        messages.cannotInstallWorkspaceInProject(internalDeps[0].name)
      );
    }
    return true;
  }

  const installedVersions = {};

  for (let dep of externalDeps) {
    const installed = project.pkg.getDependencyVersionRange(dep.name);
    // If we aren't specified a version, use the same one from the project
    const depVersion = dep.version || installed;
    if (depVersion !== installed) {
      throw new BoltError(
        messages.depMustMatchProject(
          pkg.config.getName(),
          dep.name,
          installed,
          depVersion
        )
      );
    }
    installedVersions[dep.name] = depVersion;
  }

  for (let dep of internalDeps) {
    const dependencyPkg = (depGraph.get(dep.name) || {}).pkg;
    const internalVersion = dependencyPkg.config.getVersion();
    // If no version is requested, default to caret at the current version
    const requestedVersion = dep.version || `^${internalVersion}`;
    if (!semver.satisfies(internalVersion, requestedVersion)) {
      throw new BoltError(
        messages.packageMustDependOnCurrentVersion(
          pkg.config.getName(),
          dep.name,
          internalVersion,
          requestedVersion
        )
      );
    }
    installedVersions[dep.name] = requestedVersion;
  }

  for (let [depName, depVersion] of Object.entries(installedVersions)) {
    await pkg.setDependencyVersionRange(depName, type, String(depVersion));
  }

  await symlinkPackageDependencies(project, pkg, dependencyNames);
}
