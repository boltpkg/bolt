// @flow
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';

export type ConfigSetOptions = {};

export function toConfigSetOptions(
  args: options.Args,
  flags: options.Flags
): ConfigSetOptions {
  return {};
}

export async function configSet(opts: ConfigSetOptions) {
  throw new BoltError('Unimplemented command "config set"');
}
