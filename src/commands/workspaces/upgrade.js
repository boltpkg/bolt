// @flow
import type { FilterOpts } from '../../types';
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';
import * as Upgrade from '../upgrade';
import chalk from 'chalk';

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
    throw new BoltError(
      `${chalk.red.bold(
        '[bolt workspace upgrade]'
      )} Unable to upgrade dependencies for a single/ some workspace. \nTherefore, flags ${chalk.red.bold(
        filterOpts.join(' ')
      )} are not applicable here. \nIn order to upgrade a dependency please run without filter flags - ${chalk.green.bold(
        '"bolt upgrade [...args]"'
      )} or ${chalk.green.bold('"bolt workspaces upgrade [...args]"')}`
    );
  }

  // Calling upgrade on project
  await Upgrade.upgrade(Upgrade.toUpgradeOptions(opts.deps, opts.flags));
}
