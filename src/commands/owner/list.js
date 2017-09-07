// @flow
import * as options from '../../utils/options';
import {PError} from '../../utils/errors';

export type OwnerListOptions = {};

export function toOwnerListOptions(args: options.Args, flags: options.Flags): OwnerListOptions {
  return {};
}

export async function ownerList(opts: OwnerListOptions) {
  throw new PError('Unimplemented command "owner list"');
}
