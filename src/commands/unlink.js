// @flow
import * as options from '../utils/options';
import { PError } from '../utils/errors';

export type UnlinkOptions = {};

export function toUnlinkOptions(
  args: options.Args,
  flags: options.Flags
): UnlinkOptions {
  return {};
}

export async function unlink(opts: UnlinkOptions) {
  throw new PError('Unimplemented command "unlink"');
}
