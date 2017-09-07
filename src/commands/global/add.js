// @flow
import * as options from '../../utils/options';
import {PError} from '../../utils/errors';

export type GlobalAddOptions = {};

export function toGlobalAddOptions(args: options.Args, flags: options.Flags): GlobalAddOptions {
  return {};
}

export async function globalAdd(opts: GlobalAddOptions) {
  throw new PError('Unimplemented command "global add"');
}
