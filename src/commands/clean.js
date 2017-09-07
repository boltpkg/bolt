// @flow
import * as options from '../utils/options';
import {PError} from '../utils/errors';

export type CleanOptions = {};

export function toCleanOptions(args: options.Args, flags: options.Flags): CleanOptions {
  return {};
}

export async function clean(opts: CleanOptions) {
  throw new PError('Unimplemented command "clean"');
}
