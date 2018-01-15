// @flow
import chalk from 'chalk';
import type Workspace from '../Workspace';
import type Package from '../Package';

/*::
export opaque type Message = string;
*/

export function toString(message: Message | Buffer | string): string {
  return message.toString();
}

export function toMessage(str: string): Message {
  return str;
}

function normalPkg(str: string) {
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
): Message {
  return `Package ${normalPkg(
    name
  )} must depend on the current version of ${normalPkg(depName)}: ${goodVer(
    expected
  )} vs ${badVer(actual)}`;
}

export function depMustBeAddedToProject(
  pkgName: string,
  depName: string
): Message {
  return `Package ${normalPkg(pkgName)} dependency ${normalPkg(
    depName
  )} must be added to project dependencies.`;
}

export function depMustMatchProject(
  pkgName: string,
  depName: string,
  expected: string,
  actual: string
): Message {
  return `Package ${normalPkg(pkgName)} dependency ${normalPkg(
    depName
  )} must match version in project dependencies. ${goodVer(
    expected
  )} vs ${badVer(actual)}`;
}

export function projectCannotDependOnWorkspace(depName: string): Message {
  return `Project cannot depend on workspace Package ${normalPkg(depName)}`;
}

export function invalidBoltVersion(
  actualVersion: string,
  expectedVersion: string
): Message {
  return `Project expects a bolt version of ${goodVer(
    expectedVersion
  )} but found ${badVer(actualVersion)}
run \`yarn global add "bolt@${expectedVersion}"\` to resolve`;
}

export function unableToUpdateDepVersion(
  pkgName: string,
  depName: string,
  version: string
): Message {
  return `Unable to update package ${normalPkg(pkgName)} dependency ${normalPkg(
    depName
  )} to version ${goodVer(version)}`;
}

export function addedPackageDependency(
  pkgName: string,
  depName: string,
  versionRange: string
): Message {
  return `Added package ${normalPkg(pkgName)} dependency ${normalPkg(
    depName
  )} at version ${goodVer(versionRange)}`;
}

export function updatedPackageDependency(
  pkgName: string,
  depName: string,
  versionRange: string,
  prevVersionRange: string
): Message {
  return `Updated package ${normalPkg(pkgName)} dependency ${normalPkg(
    depName
  )} to version ${goodVer(versionRange)} from ${badVer(prevVersionRange)}`;
}

export function removedPackageDependency(
  pkgName: string,
  depName: string
): Message {
  return `Removed package ${normalPkg(pkgName)} dependency ${normalPkg(
    depName
  )}`;
}

export function unableToNormalizeVersionRanges(
  depName: string,
  versionDetails: string
): Message {
  return `Unable to normalize ${normalPkg(
    depName
  )} for version ranges: ${versionDetails}`;
}

export function dependencyNotInstalled(depName: string): Message {
  return `You do not have a dependency named ${normalPkg(depName)} installed.`;
}

export function cannotRemoveDependencyDependendOnByWorkspaces(
  depName: string,
  workspaces: Array<Workspace>
): Message {
  return `Cannot remove dependency ${normalPkg(
    depName
  )} that is depended on by some workspaces:\n${workspaces
    .map(workspace => ` - ${normalPkg(workspace.pkg.config.getName())}`)
    .join('\n')}`;
}
export function externalDepsPassedToUpdatePackageVersions(
  externalDeps: Array<string>
): Message {
  return `Attempted to pass external dependencies to updatePackageVersions:\n${externalDeps.join(
    ', '
  )}`;
}

export function runWorkspacesRemoveDependency(depName: string): Message {
  return `Run ${cmd(
    `bolt workspaces remove ${depName}`
  )} to remove from all workspaces`;
}

export function couldntRemoveDependencies(deps: Array<string>): Message {
  return `Could not remove dependencies:\n${deps
    .map(depName => ` - ${normalPkg(depName)}`)
    .join('\n')}`;
}

export function couldntSymlinkDependencyNotExists(
  pkgName: string,
  depName: string
): Message {
  return `Could not symlink ${depName} in ${pkgName} as no dependency exists`;
}

export function doneInSeconds(rounded: number): Message {
  return `Done in ${rounded}s.`;
}

export function boltVersion(version: string): Message {
  return `bolt v${version}`;
}

export function nodeVersion(version: string): Message {
  return `(node v${version})`;
}

export function helpContent(): string {
  return `
    usage
      $ bolt [command] <...args> <...opts>

    commands
      init         init a bolt project
      install      install a bolt project
      add          add a dependency to a bolt project
      upgrade      upgrade a dependency in a bolt project
      remove       remove a dependency from a bolt project
      exec         execute a command in a bolt project
      run          run a script in a bolt project
      publish      publish all the packages in a bolt project
      workspaces   run a bolt command inside all workspaces
      workspace    run a bolt command inside a specific workspace
      help         get help with bolt commands
  `;
}

export function noPackagesMatchFilters(): Message {
  return 'No packages match the filters provided';
}

export function removedDependencies(): Message {
  return 'Removed dependencies';
}

export function npmPackageCouldNotBeFound(pkgName: string): Message {
  return `Package named ${normalPkg(
    pkgName
  )} could not be found, this could mean you have not published this package yet`;
}

export function notDistTagFound(tagName: string, pkgName: string): Message {
  return `No dist tag ${normalPkg(tagName)} found for package ${normalPkg(
    pkgName
  )}`;
}

export function npmDistTagRm(tagName: string, pkgName: string): Message {
  return `npm dist-tag rm ${pkgName} ${tagName}`;
}

export function npmDistTagAdd(
  pkgName: string,
  pkgVersion: string,
  tagName: string
): Message {
  return `npm dist-tag add ${pkgName}@${pkgVersion} ${tagName}`;
}

export function npmPublish(pkgName: string): Message {
  return `npm publish ${pkgName}`;
}

export function npmInfo(pkgName: string): Message {
  return `npm info ${pkgName}`;
}

export function npmInfo404(pkgName: string): Message {
  return `Recieved 404 for npm info ${normalPkg(pkgName)}`;
}

export function lockingAllPackages(): Message {
  return 'Attempting to get locks for all packages';
}

export function validatingProject(): Message {
  return '[1/3] Validating project...';
}
export function installingProjectDependencies(): Message {
  return '[2/3] Installing project dependencies...';
}

export function linkingWorkspaceDependencies(): Message {
  return '[3/3] Linking workspace dependencies...';
}

export function publishingPackage(
  pkgName: string,
  pkgVersion: string
): Message {
  return `Publishing ${normalPkg(pkgName)} at ${goodVer(pkgVersion)}`;
}

export function noUnpublishedPackagesToPublish(): Message {
  return 'No unpublished packages to publish';
}

export function notPublishingPackage(
  pkgLocalVersion: string,
  pkgPublishedVersion: string,
  pkgName: string
): Message {
  return `${pkgName} is not being published because version ${pkgPublishedVersion} is already published on npm and we are trying to publish version ${pkgLocalVersion}`;
}

export function couldNotBeNormalized(): Message {
  return 'The following packages could not be normalized:';
}

export function installedAndLinkedWorkspaces(): Message {
  return 'Installed and linked workspaces.';
}

export function cannotInstallWorkspaceInProject(pkgName: string): Message {
  return `Cannot install workspace "${pkgName}" as a dependency of a project`;
}

export function cannotUpgradeWorkspaceDependencyInProject(
  pkgName: string
): Message {
  return `Cannot upgrade workspace "${pkgName}" as a dependency of a project`;
}

export function errorParsingJSON(filePath: string): Message {
  return `Error parsing JSON in file:\n${filePath}`;
}

export function invalidBoltWorkspacesFromUpdate(
  name: string,
  depName: string,
  depRange: string,
  newVersion: string
): Message {
  return `${name} has a dependency on ${depName} at ${depRange}, however the new version of ${newVersion} leaves this range. You will need to make a new changeset that includes an update to ${name}`;
}

export function unableToInstall(): Message {
  return `Project is invalid, bolt is unable to install`;
}

export function cannotInitConfigMissingPkgJSON(filePath: string): Message {
  const basePath = filePath.replace(/.package\.json$/, '');
  return `This folder does not contain a package.json:\n${basePath}
  
  Sometimes this is caused by incomplete packages or switching branches.
  
  Try removing the directory or fixing the package and run bolt again.`;
}

export function unsafeCycles(): Message {
  return 'Task ran with unsafe dependency cycles in workspaces.';
}

export function linkInternalPackage(internalPackageName: string): Message {
  return `Cannot link project package (${internalPackageName}), as these are already linked`;
}

export function unlinkInternalPackage(internalPackageName: string): Message {
  return `Cannot unlink project package (${internalPackageName})`;
}
