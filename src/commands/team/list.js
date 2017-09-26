// @flow
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';

export type TeamListOptions = {};

export function toTeamListOptions(
  args: options.Args,
  flags: options.Flags
): TeamListOptions {
  return {};
}

export async function teamList(opts: TeamListOptions) {
  throw new BoltError('Unimplemented command "team list"');
}
