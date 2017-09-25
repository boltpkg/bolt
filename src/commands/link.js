// @flow
import * as options from '../utils/options';
import { PError } from '../utils/errors';

export type LinkOptions = {};

export function toLinkOptions(
  args: options.Args,
  flags: options.Flags
): LinkOptions {
  return {};
}

export async function link(opts: LinkOptions) {
  throw new PError('Unimplemented command "link"');
}
