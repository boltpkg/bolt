// @flow
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';

export type WorkspaceUpgradeOptions = {
  cwd?: string
};

export function toWorkspaceUpgradeOptions(
  args: options.Args,
  flags: options.Flags
): WorkspaceUpgradeOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd')
  };
}

export async function workspaceUpgrade(opts: WorkspaceUpgradeOptions) {
  throw new BoltError('Unimplemented command "workspace upgrade"');
}
