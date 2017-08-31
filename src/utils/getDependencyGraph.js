// @flow
import Project from '../Project';
import * as yarn from '../utils/yarn';

export default async function getDependencyGraph(opts: { cwd?: string } = {}) {
  const cwd = process.cwd();
  const project = await Project.init(cwd);
  const workspaces = await project.getWorkspaces();

  const {
    graph: dependencyGraph,
    valid: graphIsValid
  } = await project.getDependencyGraph(workspaces);

  if (!graphIsValid) throw new Error('Dependency graph is not valid');

  let simplifiedDependencyGraph = new Map();

  dependencyGraph.forEach((pkgInfo, pkgName) => {
    simplifiedDependencyGraph.set(pkgName, pkgInfo.dependencies);
  });

  return simplifiedDependencyGraph;
}