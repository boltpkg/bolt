// @flow
import * as options from '../../utils/options';
import {PError} from '../../utils/errors';

export type WorkspacesRemoveOptions = {
  cwd?: string,
};

export function toWorkspacesRemoveOptions(args: options.Args, flags: options.Flags): WorkspacesRemoveOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd'),
  };
}

export async function workspacesRemove(opts: WorkspacesRemoveOptions) {
  throw new PError('Unimplemented command "workspaces remove"');
}
