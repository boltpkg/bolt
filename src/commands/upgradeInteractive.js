// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';

type UpgradeInteractiveOptions = {};

function toUpgradeInteractiveOptions(
  args: options.Args,
  flags: options.Flags
): UpgradeInteractiveOptions {
  return {};
}

export async function upgradeInteractive(
  flags: options.Flags,
  args: Array<string>
) {
  throw new BoltError('Unimplemented command "upgrade-interactive"');
}
