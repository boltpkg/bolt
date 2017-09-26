// @flow
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';

export type ProjectAddOptions = {};

export function toProjectAddOptions(
  args: options.Args,
  flags: options.Flags
): ProjectAddOptions {
  return {};
}

export async function projectAdd(opts: ProjectAddOptions) {
  throw new BoltError('Unimplemented command "project add"');
}
