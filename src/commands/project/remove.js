// @flow
import * as options from '../../utils/options';
import {PError} from '../../utils/errors';

export type ProjectRemoveOptions = {};

export function toProjectRemoveOptions(args: options.Args, flags: options.Flags): ProjectRemoveOptions {
  return {};
}

export async function projectRemove(opts: ProjectRemoveOptions) {
  throw new PError('Unimplemented command "project remove"');
}
