// @flow
import type { FilterOpts } from '../../types';
import * as options from '../../utils/options';
import * as messages from '../../utils/messages';
import { BoltError } from '../../utils/errors';
import * as Upgrade from '../upgrade';

export type WorkspacesUpgradeOptions = {
  cwd?: string,
  deps: Array<string>,
  filterOpts: FilterOpts,
  flags: options.Flags
};

export function toWorkspacesUpgradeOptions(
  args: options.Args,
  flags: options.Flags
): WorkspacesUpgradeOptions {
  return {
    deps: args,
    filterOpts: options.toFilterOpts(flags),
    flags
  };
}

export async function workspacesUpgrade(opts: WorkspacesUpgradeOptions) {
  let cwd = opts.cwd || process.cwd();
  let filterOpts = Object.keys(opts.filterOpts);

  if (filterOpts.length) {
    throw new BoltError(messages.errorWorkspacesUpgrade(filterOpts));
  }

  // Calling upgrade on project
  await Upgrade.upgrade(Upgrade.toUpgradeOptions(opts.deps, opts.flags));
}
