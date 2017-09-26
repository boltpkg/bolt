// @flow
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';

export type ConfigListOptions = {};

export function toConfigListOptions(
  args: options.Args,
  flags: options.Flags
): ConfigListOptions {
  return {};
}

export async function configList(opts: ConfigListOptions) {
  throw new BoltError('Unimplemented command "config list"');
}
