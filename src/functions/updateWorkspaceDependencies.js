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
  let workspaces = await project.getWorkspaces();
  let { graph } = await project.getDependencyGraph(workspaces);
  let editedPackages = new Set();

  // Note: all dependencyToUpgrade are external dependencies

  for (let workspace of workspaces) {
    let pkg = workspace.pkg;
    let pkgDependencies = pkg.getAllDependencies();
    let name = workspace.pkg.config.getName();
    for (let depName in dependencyToUpgrade) {
      if (pkgDependencies.has(depName)) {
        const depType = pkg.getDependencyTypes(depName);
        editedPackages.add(name);
        await pkg.setDependencyVersionRange(
          depName,
          depType,
          dependencyToUpgrade[depName]
        );
      }
    }
  }

  return editedPackages;
}
