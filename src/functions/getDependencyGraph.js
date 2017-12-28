// @flow
import Project from '../Project';
import DependencyGraph from '../DependencyGraph';
import * as yarn from '../utils/yarn';

type Options = {
  cwd?: string
};

type DepGraph = Map<string, Array<string>>;

export default async function getDependencyGraph(
  opts: Options = {}
): Promise<DepGraph> {
  let cwd = opts.cwd || process.cwd();
  let project: Project = await Project.init(cwd);
  let workspaces = await project.getWorkspaces();
  let graph = new DependencyGraph(project, workspaces);

  if (!graph.isValid()) {
    throw new Error('Dependency graph is not valid');
  }

  let simplifiedDependencyGraph = new Map();

  for (let [workspace, { dependencies }] of graph.entries()) {
    simplifiedDependencyGraph.set(
      workspace.getName(),
      Array.from(dependencies).map(dep => dep.getName())
    );
  }

  return simplifiedDependencyGraph;
}
