// @flow
import Project from '../Project';
import * as yarn from '../utils/yarn';

type Options = {
  cwd?: string,
};

type DependencyGraph = Map<string, Array<string>>;

export default async function getDependencyGraph(opts: Options = {}): Promise<DependencyGraph> {
  let cwd = opts.cwd || process.cwd();
  let project = await Project.init(cwd);
  let workspaces = await project.getWorkspaces();

  let {
    graph: dependencyGraph,
    valid: graphIsValid
  } = await project.getDependencyGraph(workspaces);

  if (!graphIsValid) {
    throw new Error('Dependency graph is not valid');
  }

  let simplifiedDependencyGraph = new Map();

  dependencyGraph.forEach((pkgInfo, pkgName) => {
    simplifiedDependencyGraph.set(pkgName, pkgInfo.dependencies);
  });

  return simplifiedDependencyGraph;
}
