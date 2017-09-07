// @flow
import * as options from '../../utils/options';
import {PError} from '../../utils/errors';

export type GlobalListOptions = {};

export function toGlobalListOptions(args: options.Args, flags: options.Flags): GlobalListOptions {
  return {};
}

export async function globalList(opts: GlobalListOptions) {
  throw new PError('Unimplemented command "global list"');
}
