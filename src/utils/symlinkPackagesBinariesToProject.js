// @flow
import path from 'path';
import Project from '../Project';
import * as fs from './fs';

export default async function symlinkPackagesBinaries(project: Project) {
  let projectBinPath = project.pkg.nodeModulesBin;
  let packages = await project.getPackages();
  // let { graph: dependencyGraph } = await project.getDependencyGraph(packages);

  let symlinksToCreate = [];

  for (let pkg of packages) {
    const pkgBins = await pkg.getBins();

    if (pkgBins.length === 0) {
      continue;
    }

    for (let pkgBin of pkgBins) {
      let binName = pkgBin.name.split('/').pop();
      let src = pkgBin.filePath;
      let dest = path.join(projectBinPath, binName);

      symlinksToCreate.push({ src, dest, type: 'exec' });
    }
  }

  await Promise.all(
    symlinksToCreate.map(({ src, dest, type }) => fs.symlink(src, dest, type))
  );
}
