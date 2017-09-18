// @flow
import * as options from '../../utils/options';
import {PError} from '../../utils/errors';

export type WorkspacesUpgradeOptions = {
  cwd?: string,
};

export function toWorkspacesUpgradeOptions(args: options.Args, flags: options.Flags): WorkspacesUpgradeOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd'),
  };
}

export async function workspacesUpgrade(opts: WorkspacesUpgradeOptions) {
  throw new PError('Unimplemented command "workspaces upgrade"');
}
