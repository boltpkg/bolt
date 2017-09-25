// @flow
import * as options from '../utils/options';
import { PError } from '../utils/errors';

export type UpgradeOptions = {};

export function toUpgradeOptions(
  args: options.Args,
  flags: options.Flags
): UpgradeOptions {
  return {};
}

export async function upgrade(opts: UpgradeOptions) {
  throw new PError('Unimplemented command "upgrade"');
}
