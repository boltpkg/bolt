// @flow
import * as options from '../utils/options';
import {PError} from '../utils/errors';

export type DocOptions = {};

export function toDocOptions(args: options.Args, flags: options.Flags): DocOptions {
  return {};
}

export async function doc(opts: DocOptions) {
  throw new PError('Unimplemented command "doc"');
}
