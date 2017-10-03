// @flow
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';

export type GlobalBinOptions = {};

export function toGlobalBinOptions(
  args: options.Args,
  flags: options.Flags
): GlobalBinOptions {
  return {};
}

export async function globalBin(opts: GlobalBinOptions) {
  throw new BoltError('Unimplemented command "global bin"');
}
