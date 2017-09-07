// @flow
import * as options from '../../utils/options';
import {PError} from '../../utils/errors';

export type TagRemoveOptions = {};

export function toTagRemoveOptions(args: options.Args, flags: options.Flags): TagRemoveOptions {
  return {};
}

export async function tagRemove(opts: TagRemoveOptions) {
  throw new PError('Unimplemented command "tag remove"');
}
