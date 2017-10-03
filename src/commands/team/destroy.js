// @flow
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';

export type TeamDestroyOptions = {};

export function toTeamDestroyOptions(
  args: options.Args,
  flags: options.Flags
): TeamDestroyOptions {
  return {};
}

export async function teamDestroy(opts: TeamDestroyOptions) {
  throw new BoltError('Unimplemented command "team destroy"');
}
