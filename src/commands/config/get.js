// @flow
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';

export type ConfigGetOptions = {};

export function toConfigGetOptions(
  args: options.Args,
  flags: options.Flags
): ConfigGetOptions {
  return {};
}

export async function configGet(opts: ConfigGetOptions) {
  throw new BoltError('Unimplemented command "config get"');
}
