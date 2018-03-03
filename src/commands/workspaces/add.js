// @flow
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';

type WorkspacesAddOptions = {
  cwd?: string
};

function toWorkspacesAddOptions(
  args: options.Args,
  flags: options.Flags
): WorkspacesAddOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd')
  };
}

export async function workspacesAdd(flags: options.Flags, args: options.Args) {
  throw new BoltError('Unimplemented command "workspaces add"');
}
