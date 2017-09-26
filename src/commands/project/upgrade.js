// @flow
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';

export type ProjectUpgradeOptions = {};

export function toProjectUpgradeOptions(
  args: options.Args,
  flags: options.Flags
): ProjectUpgradeOptions {
  return {};
}

export async function projectUpgrade(opts: ProjectUpgradeOptions) {
  throw new BoltError('Unimplemented command "project upgrade"');
}
