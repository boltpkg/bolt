// @flow
import * as options from '../../utils/options';
import * as messages from '../../utils/messages';
import { BoltError } from '../../utils/errors';

type WorkspaceUpgradeOptions = {
  cwd?: string,
  args?: Array<string>
};

function toWorkspaceUpgradeOptions(
  args: options.Args,
  flags: options.Flags
): WorkspaceUpgradeOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd')
  };
}

export async function workspaceUpgrade(
  flags: options.Flags,
  subCommandArgs: Array<string>
) {
  throw new BoltError(messages.errorWorkspaceUpgrade());
}
