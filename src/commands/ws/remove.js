// @flow
import * as options from '../../utils/options';

export type WorkspaceRemoveOptions = {
  cwd?: string,
};

export function toWorkspaceRemoveOptions(args: options.Args, flags: options.Flags): WorkspaceRemoveOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd'),
  };
}

export async function workspaceRemove(opts: WorkspaceRemoveOptions) {
  let cwd = opts.cwd || process.cwd();
  // ...
}
