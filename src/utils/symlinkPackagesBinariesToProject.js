// @flow
import path from 'path';
import pathIsInside from 'path-is-inside';
import includes from 'array-includes';

import Project from '../Project';
import Package from '../Package';
import { BoltError } from './errors';
import * as fs from './fs';
import * as logger from './logger';
import * as messages from './messages';
import * as yarn from './yarn';

export default async function symlinkPackagesBinaries(project: Project) {
  let projectBinPath = project.pkg.nodeModulesBin;
  let packages = await project.getPackages();
  let { graph: dependencyGraph } = await project.getDependencyGraph(packages);

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
