// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';

export type InfoOptions = {};

export function toInfoOptions(
  args: options.Args,
  flags: options.Flags
): InfoOptions {
  return {};
}

export async function info(opts: InfoOptions) {
  throw new BoltError('Unimplemented command "info"');
}
