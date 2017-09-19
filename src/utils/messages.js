// @flow
import chalk from 'chalk';
import type Workspace from '../Workspace';

function normalPkg(str) {
  return chalk.cyan(`"${str}"`);
}

function goodVer(str) {
  return chalk.green(`"${str}"`);
}

function badVer(str) {
  return chalk.red(`"${str}"`);
}

function cmd(str) {
  return chalk.bgBlack.magenta(`\`${str}\``);
}

export function packageMustDependOnCurrentVersion(
  name: string,
  depName: string,
  expected: string,
  actual: string
) {
  return `Package ${normalPkg(
    name
  )} must depend on the current version of ${normalPkg(depName)}: ${goodVer(
    expected
  )} vs ${badVer(actual)}`;
}

export function depMustBeAddedToProject(pkgName: string, depName: string) {
  return `Package ${normalPkg(pkgName)} dependency ${normalPkg(
    depName
  )} must be added to project dependencies.`;
}

export function depMustMatchProject(
  pkgName: string,
  depName: string,
  expected: string,
  actual: string
) {
  return `Package ${normalPkg(pkgName)} dependency ${normalPkg(
    depName
  )} must match version in project dependencies. ${goodVer(
    expected
  )} vs ${badVer(actual)}`;
}

export function unableToUpdateDepVersion(
  pkgName: string,
  depName: string,
  version: string
) {
  return `Unable to update package ${normalPkg(pkgName)} dependency ${normalPkg(
    depName
  )} to version ${goodVer(version)}`;
}

export function updatedPackageDependency(
  pkgName: string,
  depName: string,
  versionRange: string,
  prevVersionRange?: string
) {
  let str = `Updated package ${normalPkg(pkgName)} dependency ${normalPkg(
    depName
  )} to version ${goodVer(versionRange)}`;
  if (prevVersionRange) str += ` from ${badVer(prevVersionRange)}`;
  return str;
}

export function unableToNormalizeVersionRanges(
  depName: string,
  versionDetails: string
) {
  return `Unable to normalize ${normalPkg(
    depName
  )} for version ranges: ${versionDetails}`;
}

export function dependencyNotInstalled(depName: string) {
  return `You do not have a dependency named ${normalPkg(depName)} installed.`;
}

export function cannotRemoveDependencyDependendOnByWorkspaces(
  depName: string,
  workspaces: Array<Workspace>
) {
  return `Cannot remove dependency ${normalPkg(
    depName
  )} that is depended on by some workspaces:\n${workspaces
    .map(workspace => ` - ${normalPkg(workspace.pkg.config.name)}`)
    .join('\n')}`;
}

export function runWorkspacesRemoveDependency(depName: string) {
  return `Run ${cmd(
    `pyarn workspaces remove ${depName}`
  )} to remove from all workspaces`;
}

export function couldntRemoveDependencies(deps: Array<string>) {
  return `Could not remove dependencies:\n${deps
    .map(depName => ` - ${normalPkg(depName)}`)
    .join('\n')}`;
}
