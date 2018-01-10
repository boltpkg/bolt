// @flow
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';
import chalk from 'chalk';

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
  throw new BoltError(
    `${chalk.red.bold(
      '[bolt workspace upgrade]'
    )} Unable to upgrade dependencies for a single workspace. \nIn order to upgrade a dependency [across all the workspaces] please run ${chalk.green.bold(
      '"bolt upgrade [...args]"'
    )} or ${chalk.green.bold('"bolt workspaces upgrade [...args]"')}`
  );
}
