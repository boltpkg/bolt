// @flow
import * as options from '../../utils/options';
import {PError} from '../../utils/errors';

export type ProjectUpgradeOptions = {};

export function toProjectUpgradeOptions(args: options.Args, flags: options.Flags): ProjectUpgradeOptions {
  return {};
}

export async function projectUpgrade(opts: ProjectUpgradeOptions) {
  throw new PError('Unimplemented command "project upgrade"');
}
