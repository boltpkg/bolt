// @flow

import Project from '../Project';
import type Workspace from '../Workspace';
import type Package from '../Package';
import type { Dependency, configDependencyType } from '../types';
import * as logger from './logger';
import * as yarn from './yarn';

export default async function addDependenciesToPackage(
  project: Project,
  pkg: Package,
  dependencies: Array<Dependency>,
  type?: configDependencyType
) {
  const isProjectPackage = project.pkg.dir === pkg.dir;
  if (isProjectPackage) {
    await yarn.add(project.pkg, dependencies);
    return true;
  }

  const projectDependencies = project.pkg.getAllDependencies();
  const depsToInstallInProject = dependencies.filter(
    dep => !projectDependencies.has(dep.name)
  );

  await yarn.add(project.pkg, depsToInstallInProject);

  const depsToSymlink = [];
  dependencies.forEach(dep => {});
}
