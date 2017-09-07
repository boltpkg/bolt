// @flow
import * as options from '../../utils/options';
import {PError} from '../../utils/errors';

export type TeamAddOptions = {};

export function toTeamAddOptions(args: options.Args, flags: options.Flags): TeamAddOptions {
  return {};
}

export async function teamAdd(opts: TeamAddOptions) {
  throw new PError('Unimplemented command "team add"');
}
