// @flow
import Project from '../Project';

type VersionMap = {
  [x: string]: any
};

type Options = {
  cwd?: string
};

function versionRangeToRangeType(versionRange: string) {
  if (versionRange.charAt(0) === '^') return '^';
  if (versionRange.charAt(0) === '~') return '~';
  return '';
}

export default async function updateWorkspaceDependencies(
  dependencyToUpgrade: VersionMap,
  opts: Options = {}
) {
  let cwd = opts.cwd || process.cwd();
  let project = await Project.init(cwd);
  let packages = await project.getPackages();
  let { graph } = await project.getDependencyGraph(packages);
  let editedPackages = new Set();

  // Note: all dependencyToUpgrade are external dependencies

  for (let pkg of packages) {
    let pkgDependencies = pkg.getAllDependencies();
    let name = pkg.getName();

    for (let depName in dependencyToUpgrade) {
      if (pkgDependencies.has(depName)) {
        let depTypes = pkg.getDependencyTypes(depName);
        editedPackages.add(name);
        for (let depType of depTypes) {
          await pkg.setDependencyVersionRange(
            depName,
            depType,
            dependencyToUpgrade[depName]
          );
        }
      }
    }
  }

  return editedPackages;
}
