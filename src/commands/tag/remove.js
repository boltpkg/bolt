// @flow
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';

export type TagRemoveOptions = {};

export function toTagRemoveOptions(
  args: options.Args,
  flags: options.Flags
): TagRemoveOptions {
  return {};
}

export async function tagRemove(opts: TagRemoveOptions) {
  throw new BoltError('Unimplemented command "tag remove"');
}
