// @flow
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';

export type ConfigDeleteOptions = {};

export function toConfigDeleteOptions(
  args: options.Args,
  flags: options.Flags
): ConfigDeleteOptions {
  return {};
}

export async function configDelete(opts: ConfigDeleteOptions) {
  throw new BoltError('Unimplemented command "config delete"');
}
