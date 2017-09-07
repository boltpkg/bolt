// @flow
import * as options from '../../utils/options';
import {PError} from '../../utils/errors';

export type GlobalBinOptions = {};

export function toGlobalBinOptions(args: options.Args, flags: options.Flags): GlobalBinOptions {
  return {};
}

export async function globalBin(opts: GlobalBinOptions) {
  throw new PError('Unimplemented command "global bin"');
}
