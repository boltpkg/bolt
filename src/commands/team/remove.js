// @flow
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';

export type TeamRemoveOptions = {};

export function toTeamRemoveOptions(
  args: options.Args,
  flags: options.Flags
): TeamRemoveOptions {
  return {};
}

export async function teamRemove(opts: TeamRemoveOptions) {
  throw new BoltError('Unimplemented command "team remove"');
}
