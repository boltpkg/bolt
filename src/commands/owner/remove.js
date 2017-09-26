// @flow
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';

export type OwnerRemoveOptions = {};

export function toOwnerRemoveOptions(
  args: options.Args,
  flags: options.Flags
): OwnerRemoveOptions {
  return {};
}

export async function ownerRemove(opts: OwnerRemoveOptions) {
  throw new BoltError('Unimplemented command "owner remove"');
}
