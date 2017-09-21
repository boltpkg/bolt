// @flow
import Project from '../Project';
import Workspace from '../Workspace';

type VersionMap = {
  [name: string]: string
};

type Options = {
  cwd?: string
};

export default async function updatePackageVersions(
  versions: VersionMap,
  opts: Options = {}
): Promise<Array<string>> {
  let cwd = opts.cwd || process.cwd();
  let project = await Project.init(cwd);
  let workspaces = await project.getWorkspaces();
  let updatedPackages = new Set();

  for (let workspace of workspaces) {
    let pkg = workspace.pkg;
    let promises = [];

    for (let depName of Object.keys(versions)) {
      let depType = pkg.getDependencyType(depName);
      if (!depType) continue;
      promises.push(
        pkg.setDependencyVersionRange(depName, depType, '^' + versions[depName])
      );
      updatedPackages.add(pkg.filePath);
    }

    await Promise.all(promises);
  }

  return Array.from(updatedPackages);
}
