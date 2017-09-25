// @flow
import * as options from '../utils/options';
import { PError } from '../utils/errors';

export type BinOptions = {};

export function toBinOptions(
  args: options.Args,
  flags: options.Flags
): BinOptions {
  return {};
}

export async function bin(opts: BinOptions) {
  throw new PError('Unimplemented command "bin"');
}
