// @flow
import * as options from '../../utils/options';
import {PError} from '../../utils/errors';

export type OwnerRemoveOptions = {};

export function toOwnerRemoveOptions(args: options.Args, flags: options.Flags): OwnerRemoveOptions {
  return {};
}

export async function ownerRemove(opts: OwnerRemoveOptions) {
  throw new PError('Unimplemented command "owner remove"');
}
