// @flow
import * as options from '../../utils/options';
import {PError} from '../../utils/errors';

export type WorkspaceRunOptions = {
  cwd?: string,
};

export function toWorkspaceRunOptions(args: options.Args, flags: options.Flags): WorkspaceRunOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd'),
  };
}

export async function workspaceRun(opts: WorkspaceRunOptions) {
  throw new PError('Unimplemented command "workspace run"');
}
