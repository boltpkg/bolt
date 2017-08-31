import multimatch from 'multimatch';
import path from 'path';

import type {Args, Opts} from '../types';
import Workspace from '../Workspace';

export default function filterWorkspaces(workspaces: [Workspace], opts: Opts) {
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

    return workspaces.filter(workspace => filteredByName.includes(workspace.pkg.config.name) &&  filteredByDir.includes(relativeDir(workspace)));
}
