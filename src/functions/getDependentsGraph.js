// @flow
import Project from '../Project';
import * as yarn from '../utils/yarn';

type Options = {
  cwd?: string
};

type DependentsGraph = Map<string, Array<string>>;

export default async function getDependentsGraph(
  opts: Options = {}
): Promise<DependentsGraph> {
  const cwd = opts.cwd || process.cwd();
  const project = await Project.init(cwd);
  const workspaces = await project.getWorkspaces();

  const {
    graph: dependentsGraph,
    valid: graphIsValid
  } = await project.getDependentsGraph(workspaces);

  if (!graphIsValid) {
    throw new Error('Dependents graph is not valid');
  }

  const simplifiedDependentsGraph = new Map();

  dependentsGraph.forEach((pkgInfo, pkgName) => {
    simplifiedDependentsGraph.set(pkgName, pkgInfo.dependents);
  });

  return simplifiedDependentsGraph;
}
