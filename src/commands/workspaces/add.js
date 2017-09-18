// @flow
import * as options from '../../utils/options';
import {PError} from '../../utils/errors';

export type WorkspacesAddOptions = {
  cwd?: string,
};

export function toWorkspacesAddOptions(args: options.Args, flags: options.Flags): WorkspacesAddOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd'),
  };
}

export async function workspacesAdd(opts: WorkspacesAddOptions) {
  throw new PError('Unimplemented command "workspaces add"');
}
