// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';

export type LinkOptions = {};

export function toLinkOptions(
  args: options.Args,
  flags: options.Flags
): LinkOptions {
  return {};
}

export async function link(opts: LinkOptions) {
  throw new BoltError('Unimplemented command "link"');
}
