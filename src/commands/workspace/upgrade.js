// @flow
import * as options from '../../utils/options';
import {PError} from '../../utils/errors';

export type WorkspaceUpgradeOptions = {
  cwd?: string,
};

export function toWorkspaceUpgradeOptions(args: options.Args, flags: options.Flags): WorkspaceUpgradeOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd'),
  };
}

export async function workspaceUpgrade(opts: WorkspaceUpgradeOptions) {
  throw new PError('Unimplemented command "workspace upgrade"');
}
