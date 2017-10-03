// @flow
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';

export type WorkspacesAddOptions = {
  cwd?: string
};

export function toWorkspacesAddOptions(
  args: options.Args,
  flags: options.Flags
): WorkspacesAddOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd')
  };
}

export async function workspacesAdd(opts: WorkspacesAddOptions) {
  throw new BoltError('Unimplemented command "workspaces add"');
}
