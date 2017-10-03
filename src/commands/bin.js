// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';

export type BinOptions = {};

export function toBinOptions(
  args: options.Args,
  flags: options.Flags
): BinOptions {
  return {};
}

export async function bin(opts: BinOptions) {
  throw new BoltError('Unimplemented command "bin"');
}
