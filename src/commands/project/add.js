// @flow
import * as options from '../../utils/options';
import {PError} from '../../utils/errors';

export type ProjectAddOptions = {};

export function toProjectAddOptions(args: options.Args, flags: options.Flags): ProjectAddOptions {
  return {};
}

export async function projectAdd(opts: ProjectAddOptions) {
  throw new PError('Unimplemented command "project add"');
}
