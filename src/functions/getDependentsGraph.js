// @flow
import Project from '../Project';
import DependencyGraph from '../DependencyGraph';
import * as yarn from '../utils/yarn';

type Options = {
  cwd?: string
};

type DepGraph = Map<string, Array<string>>;

export default async function getDependentsGraph(
  opts: Options = {}
): Promise<DepGraph> {
  let cwd = opts.cwd || process.cwd();
  let project: Project = await Project.init(cwd);
  let workspaces = await project.getWorkspaces();
  let graph = new DependencyGraph(project, workspaces);

  if (!graph.isValid()) {
    throw new Error('Dependents graph is not valid');
  }

  let simplifiedDependentsGraph = new Map();

  for (let [workspace, { dependents }] of graph.entries()) {
    simplifiedDependentsGraph.set(
      workspace.getName(),
      Array.from(dependents).map(dep => dep.getName())
    );
  }

  return simplifiedDependentsGraph;
}
