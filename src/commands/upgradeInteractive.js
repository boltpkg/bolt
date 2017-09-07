// @flow
import * as options from '../utils/options';
import {PError} from '../utils/errors';

export type UpgradeInteractiveOptions = {};

export function toUpgradeInteractiveOptions(args: options.Args, flags: options.Flags): UpgradeInteractiveOptions {
  return {};
}

export async function upgradeInteractive(opts: UpgradeInteractiveOptions) {
  throw new PError('Unimplemented command "upgrade-interactive"');
}
