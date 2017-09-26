// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';

export type UpgradeInteractiveOptions = {};

export function toUpgradeInteractiveOptions(
  args: options.Args,
  flags: options.Flags
): UpgradeInteractiveOptions {
  return {};
}

export async function upgradeInteractive(opts: UpgradeInteractiveOptions) {
  throw new BoltError('Unimplemented command "upgrade-interactive"');
}
