// @flow
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';

export type GlobalRemoveOptions = {};

export function toGlobalRemoveOptions(
  args: options.Args,
  flags: options.Flags
): GlobalRemoveOptions {
  return {};
}

export async function globalRemove(opts: GlobalRemoveOptions) {
  throw new BoltError('Unimplemented command "global remove"');
}
