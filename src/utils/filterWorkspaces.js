// @flow
import multimatch from 'multimatch';
import path from 'path';

import Workspace from '../Workspace';
import * as logger from '../utils/logger';

type FilteringOpts = {
  only?: string,
  ignore?: string,
  onlyFs?: string,
  ignoreFs?: string,
}

export default function filterWorkspaces(workspaces: Array<Workspace>, opts: FilteringOpts = {}) {
  const onlyPattern = opts.only || '**';
  const ignorePattern = opts.ignore ? `!${opts.ignore}` : '';
  const onlyFsPattern = opts.onlyFs || '**';
  const ignoreFsPattern = opts.ignoreFs ? `!${opts.ignoreFs}` : '';
  let cwd = process.cwd();

  const relativeDir = workspace => path.relative(cwd, workspace.pkg.dir)
  const workspaceNames = workspaces.map(workspace => workspace.pkg.config.name);
  const workspaceDirs = workspaces.map(workspace => relativeDir(workspace));

  const filteredByName = multimatch(workspaceNames, [onlyPattern, ignorePattern]);
  const filteredByDir = multimatch(workspaceDirs, [onlyFsPattern, ignoreFsPattern]);

  const filteredWorkspaces = workspaces
    .filter(workspace => filteredByName.includes(workspace.pkg.config.name) &&
      filteredByDir.includes(relativeDir(workspace))
    );

  if (filteredWorkspaces.length === 0) {
    logger.warn('No packages match the filters provided');
  }

  return filteredWorkspaces;
}
