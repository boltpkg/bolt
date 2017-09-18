// @flow
import * as options from '../../utils/options';
import {PError} from '../../utils/errors';

export type WorkspaceRemoveOptions = {
  cwd?: string,
};

export function toWorkspaceRemoveOptions(args: options.Args, flags: options.Flags): WorkspaceRemoveOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd'),
  };
}

export async function workspaceRemove(opts: WorkspaceRemoveOptions) {
  throw new PError('Unimplemented command "workspace remove"');
}
