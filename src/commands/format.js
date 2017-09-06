// @flow
import * as options from '../utils/options';
import {PError} from '../utils/errors';

export type FormatOptions = {};

export function toFormatOptions(args: options.Args, flags: options.Flags): FormatOptions {
  return {};
}

export async function format(opts: FormatOptions) {
  throw new PError('Unimplemented command "format"');
}
