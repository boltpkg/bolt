// @flow
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';

export type WorkspacesUpgradeOptions = {
  cwd?: string
};

export function toWorkspacesUpgradeOptions(
  args: options.Args,
  flags: options.Flags
): WorkspacesUpgradeOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd')
  };
}

export async function workspacesUpgrade(opts: WorkspacesUpgradeOptions) {
  throw new BoltError('Unimplemented command "workspaces upgrade"');
}
