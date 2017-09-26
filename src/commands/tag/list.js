// @flow
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';

export type TagListOptions = {};

export function toTagListOptions(
  args: options.Args,
  flags: options.Flags
): TagListOptions {
  return {};
}

export async function tagList(opts: TagListOptions) {
  throw new BoltError('Unimplemented command "tag list"');
}
