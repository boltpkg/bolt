// @flow
import * as options from '../utils/options';
import {PError} from '../utils/errors';

import {toTeamAddOptions, teamAdd} from './team/add';
import {toTeamCreateOptions, teamCreate} from './team/create';
import {toTeamDestroyOptions, teamDestroy} from './team/destroy';
import {toTeamListOptions, teamList} from './team/list';
import {toTeamRemoveOptions, teamRemove} from './team/remove';

export type TeamOptions = {
  command: string,
  commandArgs: options.Args,
  commandFlags: options.Flags
};

export function toTeamOptions(args: options.Args, flags: options.Flags): TeamOptions {
  let [command, ...commandArgs] = args;
  return {
    command,
    commandArgs,
    commandFlags: flags,
  };
}

export async function team(opts: TeamOptions) {
  if (opts.command === 'add') {
    await teamAdd(toTeamAddOptions(opts.commandArgs, opts.commandFlags));
  } else if (opts.command === 'create') {
    await teamCreate(toTeamCreateOptions(opts.commandArgs, opts.commandFlags));
  } else if (opts.command === 'destroy') {
    await teamDestroy(toTeamDestroyOptions(opts.commandArgs, opts.commandFlags));
  } else if (opts.command === 'list' || opts.command === 'ls' || typeof opts.command === 'undefined') {
    await teamList(toTeamListOptions(opts.commandArgs, opts.commandFlags));
  } else if (opts.command === 'remove' || opts.command === 'rm') {
    await teamRemove(toTeamRemoveOptions(opts.commandArgs, opts.commandFlags));
  } else {
    throw new PError(`You must specify a valid command to run in "pyarn team"`);
  }
}
