// @flow
import * as options from '../../utils/options';
import {PError} from '../../utils/errors';

export type ConfigDeleteOptions = {};

export function toConfigDeleteOptions(args: options.Args, flags: options.Flags): ConfigDeleteOptions {
  return {};
}

export async function configDelete(opts: ConfigDeleteOptions) {
  throw new PError('Unimplemented command "config delete"');
}
