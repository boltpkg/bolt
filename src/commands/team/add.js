// @flow
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';

export type TeamAddOptions = {};

export function toTeamAddOptions(
  args: options.Args,
  flags: options.Flags
): TeamAddOptions {
  return {};
}

export async function teamAdd(opts: TeamAddOptions) {
  throw new BoltError('Unimplemented command "team add"');
}
