// @flow
import chalk from 'chalk';

function pkg(str) {
  return chalk.cyan(`"${str}"`);
}

function goodVer(str) {
  return chalk.green(`"${str}"`);
}

function badVer(str) {
  return chalk.red(`"${str}"`);
}

export function packageMustDependOnCurrentVersion(name: string, depName: string, expected: string, actual: string) {
  return `Package ${pkg(name)} must depend on the current version of ${pkg(depName)}: ${goodVer(expected)} vs ${badVer(actual)}`;
}

export function depMustBeAddedToProject(pkgName: string, depName: string) {
  return `Package ${pkg(pkgName)} dependency ${pkg(depName)} must be added to project dependencies.`;
}

export function depMustMatchProject(pkgName: string, depName: string, expected: string, actual: string) {
  return `Package ${pkg(pkgName)} dependency ${pkg(depName)} must match version in project dependencies. ${goodVer(expected)} vs ${badVer(actual)}`;
}

export function unableToUpdateDepVersion(pkgName: string, depName: string, version: string) {
  return `Unable to update package ${pkg(pkgName)} dependency ${pkg(depName)} to version ${goodVer(version)}`;
}

export function updatedPackageDependency(pkgName: string, depName: string, versionRange: string) {
  return `Updated package ${pkg(pkgName)} dependency ${pkg(depName)} to version ${goodVer(versionRange)}`;
}
