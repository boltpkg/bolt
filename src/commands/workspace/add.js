// @flow
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';

export type WorkspaceAddOptions = {
  cwd?: string
};

export function toWorkspaceAddOptions(
  args: options.Args,
  flags: options.Flags
): WorkspaceAddOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd')
  };
}

export async function workspaceAdd(opts: WorkspaceAddOptions) {
  throw new BoltError('Unimplemented command "workspace add"');
}
