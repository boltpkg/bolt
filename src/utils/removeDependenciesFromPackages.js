// @flow
import Project from '../Project';
import type Workspace from '../Workspace';
import type Package from '../Package';
import * as logger from './logger';
import * as messages from './messages';
import * as yarn from './yarn';
import * as fs from './fs';
import * as path from 'path';
import { BoltError } from './errors';

const UNINSTALL_SCRIPTS = ['preuninstall', 'uninstall', 'postuninstall'];

function filterDependenciesForPackage(
  pkg: Package,
  dependencies: Array<string>
) {
  let allDependencies = pkg.getAllDependencies();
  return dependencies.filter(depName => {
    return allDependencies.has(depName);
  });
}

async function removeDependenciesFromPackage(
  project: Project,
  pkg: Package,
  dependencies: Array<string>
) {
  let matchedDependencies = filterDependenciesForPackage(pkg, dependencies);
  if (!matchedDependencies.length) {
    return false;
  }

  let isProjectPackage = pkg.isSamePackage(project.pkg);
  if (isProjectPackage) {
    await yarn.remove(matchedDependencies, pkg.dir);
    return true;
  }

  for (let depName of matchedDependencies) {
    let filePath = path.join(pkg.nodeModules, depName);
    let depTypes = pkg.getDependencyTypes(depName);

    // Delete directory
    await fs.rimraf(filePath);

    // Remove from package.json
    for (let depType of depTypes) {
      await pkg.setDependencyVersionRange(depName, depType, null);
    }
  }

  // TODO: Remove node_modules/.bin links

  return true;
}

export default async function removeDependenciesFromPackages(
  project: Project,
  workspaces: Array<Workspace>,
  packages: Array<Package>,
  dependencies: Array<string>
) {
  // Is the set of packages that we're modifying include the project package? ...
  let includesProjectPackage = false;

  // Which workspaces are we working with? ...
  let includedWorkspacesDirs = {};

  // ...let's find out...
  for (let pkg of packages) {
    if (pkg.isSamePackage(project.pkg)) {
      includesProjectPackage = true;
    } else {
      includedWorkspacesDirs[pkg.dir] = true;
    }
  }

  // We're going to build up a list of the invalid specified dependencies to
  // remove
  let invalid = [];

  for (let depName of dependencies) {
    // Get all of the dependents for this dependency
    let dependents = packages.filter(pkg => {
      return pkg.getAllDependencies().has(depName);
    });

    // If there are no dependents for this dependency, then we don't need
    // to do anything for it
    if (!dependents.length) {
      invalid.push(depName);
      logger.error(messages.dependencyNotInstalled(depName));
      continue;
    }

    // If we're not removing anything from the project then we don't need to do
    // anymore checks
    if (!includesProjectPackage) {
      continue;
    }

    // Build up the dependents by their directory so we can test faster
    let dependentsByDir = new Map();
    for (let dependent of dependents) {
      dependentsByDir.set(dependent.dir, dependent);
    }

    // Check to see if any workspaces (other than our dependents) depend on
    // this dependency.
    let excludedDependentWorkspaces = workspaces.filter(workspace => {
      return (
        !dependentsByDir.has(workspace.pkg.dir) &&
        workspace.pkg.getAllDependencies().has(depName)
      );
    });

    // We can't remove dependencies from our project package that aren't also
    // being removed from all of the dependent workspaces.
    if (excludedDependentWorkspaces.length) {
      invalid.push(depName);
      logger.error(
        messages.cannotRemoveDependencyDependendOnByWorkspaces(
          depName,
          excludedDependentWorkspaces
        )
      );
      logger.info(messages.runWorkspacesRemoveDependency(depName));
      continue;
    }
  }

  // If there are any invalid dependencies specified, then error
  if (invalid.length) {
    throw new BoltError(messages.couldntRemoveDependencies(invalid));
  }

  // Get an array of workspaces that we're removing from.
  let includedWorkspaces = workspaces.filter(workspace => {
    return includedWorkspacesDirs[workspace.pkg.dir];
  });

  // Run the uninstall scripts for each workspace
  await Promise.all(
    UNINSTALL_SCRIPTS.map(async script => {
      await Project.runWorkspaceTasks(includedWorkspaces, async workspace => {
        await yarn.runIfExists(workspace.pkg, script);
      });
    })
  );

  // Remove from the project package first, so that it runs the hooks correctly
  if (includesProjectPackage) {
    await removeDependenciesFromPackage(project, project.pkg, dependencies);
  }

  // Remove from every included workspace
  for (let workspace of includedWorkspaces) {
    await removeDependenciesFromPackage(project, workspace.pkg, dependencies);
  }

  logger.success(messages.removedDependencies());
}
