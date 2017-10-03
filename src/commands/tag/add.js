// @flow
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';

export type TagAddOptions = {};

export function toTagAddOptions(
  args: options.Args,
  flags: options.Flags
): TagAddOptions {
  return {};
}

export async function tagAdd(opts: TagAddOptions) {
  throw new BoltError('Unimplemented command "tag add"');
}
