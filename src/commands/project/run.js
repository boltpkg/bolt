// @flow
import * as options from '../../utils/options';
import {PError} from '../../utils/errors';

export type ProjectRunOptions = {};

export function toProjectRunOptions(args: options.Args, flags: options.Flags): ProjectRunOptions {
  return {};
}

export async function projectRun(opts: ProjectRunOptions) {
  throw new PError('Unimplemented command "project run"');
}
