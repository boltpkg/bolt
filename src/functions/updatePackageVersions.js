// @flow
import Project from '../Project';
import Workspace from '../Workspace';
import * as logger from '../utils/logger';
import * as messages from '../utils/messages';

type VersionMap = {
  [name: string]: string
};

type Options = {
  cwd?: string
};

function versionRangeToRangeType(versionRange: string) {
  if (versionRange.charAt(0) === '^') return '^';
  if (versionRange.charAt(0) === '~') return '~';
  return '';
}

/**
 * This function is used to update all the internal dependencies where you have an external source
 * bumping versions (a tool like bolt-releases for example).
 * It takes an object of packageNames and their new versions. updatePackageVersions will update all
 * internal versions of packages according to those new versions.
 * ie, a caret dep, will remain a caret dep and a pinned dep will remain pinned.
 *
 * It is up to the consumer to ensure that these new versions are not going to leave the repo in an
 * inconsistent state (internal deps leaving semver ranges).
 *
 * Note: we explicitly ignore all external dependencies passed and warn if they are.
 */
export default async function updatePackageVersions(
  versions: VersionMap,
  opts: Options = {}
): Promise<Array<string>> {
  let cwd = opts.cwd || process.cwd();
  let project = await Project.init(cwd);
  let workspaces = await project.getWorkspaces();
  let { graph } = await project.getDependencyGraph(workspaces);
  let updatedPackages = new Set();

  const internalDeps = Object.keys(versions).filter(dep => graph.has(dep));
  const externalDeps = Object.keys(versions).filter(dep => !graph.has(dep));

  if (externalDeps.length !== 0) {
    logger.warn(
      messages.externalDepsPassedToUpdatePackageVersions(externalDeps)
    );
  }

  for (let workspace of workspaces) {
    let pkg = workspace.pkg;
    let promises = [];

    for (let depName of internalDeps) {
      const depRange = String(pkg.getDependencyVersionRange(depName));
      const depTypes = pkg.getDependencyTypes(depName);
      const rangeType = versionRangeToRangeType(depRange);
      const newDepRange = rangeType + versions[depName];

      if (depTypes.length === 0) continue;
      for (let depType of depTypes) {
        await pkg.setDependencyVersionRange(depName, depType, newDepRange);
      }
      updatedPackages.add(pkg.filePath);
    }
  }

  return Array.from(updatedPackages);
}
