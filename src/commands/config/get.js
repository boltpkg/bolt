// @flow
import * as options from '../../utils/options';
import {PError} from '../../utils/errors';

export type ConfigGetOptions = {};

export function toConfigGetOptions(args: options.Args, flags: options.Flags): ConfigGetOptions {
  return {};
}

export async function configGet(opts: ConfigGetOptions) {
  throw new PError('Unimplemented command "config get"');
}
