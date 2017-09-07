// @flow
import * as options from '../../utils/options';
import {PError} from '../../utils/errors';

export type TeamCreateOptions = {};

export function toTeamCreateOptions(args: options.Args, flags: options.Flags): TeamCreateOptions {
  return {};
}

export async function teamCreate(opts: TeamCreateOptions) {
  throw new PError('Unimplemented command "team create"');
}
