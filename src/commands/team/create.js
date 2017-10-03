// @flow
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';

export type TeamCreateOptions = {};

export function toTeamCreateOptions(
  args: options.Args,
  flags: options.Flags
): TeamCreateOptions {
  return {};
}

export async function teamCreate(opts: TeamCreateOptions) {
  throw new BoltError('Unimplemented command "team create"');
}
