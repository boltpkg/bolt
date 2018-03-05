// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';
import type { CommandArgsType } from '../types';

type UpgradeInteractiveOptions = {};

function toUpgradeInteractiveOptions(
  args: options.Args,
  flags: options.Flags
): UpgradeInteractiveOptions {
  return {};
}

export async function upgradeInteractive({
  commandArgs,
  flags
}: CommandArgsType) {
  throw new BoltError('Unimplemented command "upgrade-interactive"');
}
