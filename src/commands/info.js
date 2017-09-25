// @flow
import * as options from '../utils/options';
import { PError } from '../utils/errors';

export type InfoOptions = {};

export function toInfoOptions(
  args: options.Args,
  flags: options.Flags
): InfoOptions {
  return {};
}

export async function info(opts: InfoOptions) {
  throw new PError('Unimplemented command "info"');
}
