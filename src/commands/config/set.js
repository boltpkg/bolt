// @flow
import * as options from '../../utils/options';
import {PError} from '../../utils/errors';

export type ConfigSetOptions = {};

export function toConfigSetOptions(args: options.Args, flags: options.Flags): ConfigSetOptions {
  return {};
}

export async function configSet(opts: ConfigSetOptions) {
  throw new PError('Unimplemented command "config set"');
}
