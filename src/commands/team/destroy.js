// @flow
import * as options from '../../utils/options';
import {PError} from '../../utils/errors';

export type TeamDestroyOptions = {};

export function toTeamDestroyOptions(args: options.Args, flags: options.Flags): TeamDestroyOptions {
  return {};
}

export async function teamDestroy(opts: TeamDestroyOptions) {
  throw new PError('Unimplemented command "team destroy"');
}
