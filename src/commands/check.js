// @flow
import * as options from '../utils/options';
import {PError} from '../utils/errors';

export type CheckOptions = {};

export function toCheckOptions(args: options.Args, flags: options.Flags): CheckOptions {
  return {};
}

export async function check(opts: CheckOptions) {
  throw new PError('Unimplemented command "check"');
}
