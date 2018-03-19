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
  let cwd = opts.cwd || process.cwd();
  let project = await Project.init(cwd);
  let packages = await project.getPackages();

  let {
    graph: dependentsGraph,
    valid: graphIsValid
  } = await project.getDependentsGraph(packages);

  if (!graphIsValid) {
    throw new Error('Dependents graph is not valid');
  }

  let simplifiedDependentsGraph = new Map();

  dependentsGraph.forEach((pkgInfo, pkgName) => {
    simplifiedDependentsGraph.set(pkgName, pkgInfo.dependents);
  });

  return simplifiedDependentsGraph;
}
