// @flow
import * as options from '../../utils/options';
import * as messages from '../../utils/messages';
import { BoltError } from '../../utils/errors';

export type WorkspaceUpgradeOptions = {
  cwd?: string,
  args?: Array<string>
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
  throw new BoltError(messages.errorWorkspaceUpgrade());
}
