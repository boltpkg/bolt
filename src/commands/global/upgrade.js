// @flow
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';

export type GlobalUpgradeOptions = {};

export function toGlobalUpgradeOptions(
  args: options.Args,
  flags: options.Flags
): GlobalUpgradeOptions {
  return {};
}

export async function globalUpgrade(opts: GlobalUpgradeOptions) {
  throw new BoltError('Unimplemented command "global upgrade"');
}
