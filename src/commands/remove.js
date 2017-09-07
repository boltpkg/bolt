// @flow
import * as options from '../utils/options';
import {PError} from '../utils/errors';

export type RemoveOptions = {};

export function toRemoveOptions(args: options.Args, flags: options.Flags): RemoveOptions {
  return {};
}

export async function remove(opts: RemoveOptions) {
  throw new PError('Unimplemented command "remove"');
}
