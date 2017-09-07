// @flow
import * as options from '../../utils/options';
import {PError} from '../../utils/errors';

export type OwnerAddOptions = {};

export function toOwnerAddOptions(args: options.Args, flags: options.Flags): OwnerAddOptions {
  return {};
}

export async function ownerAdd(opts: OwnerAddOptions) {
  throw new PError('Unimplemented command "owner add"');
}
