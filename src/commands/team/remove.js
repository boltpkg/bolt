// @flow
import * as options from '../../utils/options';
import {PError} from '../../utils/errors';

export type TeamRemoveOptions = {};

export function toTeamRemoveOptions(args: options.Args, flags: options.Flags): TeamRemoveOptions {
  return {};
}

export async function teamRemove(opts: TeamRemoveOptions) {
  throw new PError('Unimplemented command "team remove"');
}
