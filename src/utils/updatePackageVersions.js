//@flow
import Project from '../Project';
import Workspace from '../Workspace';
import runWorkspaceTasks from './runWorkspaceTasks';

export default async function updatePackageVersions(versions: {[name: string]: string}, opts: { cwd?: string } = {}) {
  const cwd = opts.cwd || process.cwd();

  const updateWorkspacePackageVersion = (workspace: Workspace) => {
    const pkg = workspace.pkg;
    const promises = [];

    for(let depName of Object.keys(versions)) {
      const depType = pkg.getDependencyType(depName);
      if (!depType) continue;

      promises.push(pkg.updateDependencyVersionRange(depName, depType, versions[depName]));
    }

    return Promise.all(promises);
  }

  await runWorkspaceTasks(updateWorkspacePackageVersion, opts);
}
