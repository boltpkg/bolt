// @flow
import * as options from '../utils/options';
import {PError} from '../utils/errors';

export type TagOptions = {};

export function toTagOptions(args: options.Args, flags: options.Flags): TagOptions {
  return {};
}

export async function tag(opts: TagOptions) {
  throw new PError('Unimplemented command "tag"');
}
