// @flow
import * as options from '../utils/options';
import {PError} from '../utils/errors';

import {toOwnerAddOptions, ownerAdd} from './owner/add';
import {toOwnerListOptions, ownerList} from './owner/list';
import {toOwnerRemoveOptions, ownerRemove} from './owner/remove';

export type OwnerOptions = {
  command: string,
  commandArgs: options.Args,
  commandFlags: options.Flags
};

export function toOwnerOptions(args: options.Args, flags: options.Flags): OwnerOptions {
  let [command, ...commandArgs] = args;
  return {
    command,
    commandArgs,
    commandFlags: flags,
  };
}

export async function owner(opts: OwnerOptions) {
  if (opts.command === 'add') {
    await ownerAdd(toOwnerAddOptions(opts.commandArgs, opts.commandFlags));
  } else if (opts.command === 'list' || opts.command === 'ls' || typeof opts.command === 'undefined') {
    await ownerList(toOwnerListOptions(opts.commandArgs, opts.commandFlags));
  } else if (opts.command === 'remove' || opts.command === 'rm') {
    await ownerRemove(toOwnerRemoveOptions(opts.commandArgs, opts.commandFlags));
  } else {
    throw new PError(`You must specify a valid command to run in "pyarn owner"`);
  }
}
