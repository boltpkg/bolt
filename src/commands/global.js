// @flow
import * as options from '../utils/options';
import {PError} from '../utils/errors';

import {toGlobalAddOptions, globalAdd} from './global/add';
import {toGlobalBinOptions, globalBin} from './global/bin';
import {toGlobalListOptions, globalList} from './global/list';
import {toGlobalRemoveOptions, globalRemove} from './global/remove';
import {toGlobalUpgradeOptions, globalUpgrade} from './global/upgrade';

export type GlobalOptions = {
  command: string,
  commandArgs: options.Args,
  commandFlags: options.Flags
};

export function toGlobalOptions(args: options.Args, flags: options.Flags): GlobalOptions {
  let [command, ...commandArgs] = args;
  return {
    command,
    commandArgs,
    commandFlags: flags,
  };
}

export async function global_(opts: GlobalOptions) {
  if (opts.command === 'add') {
    await globalAdd(toGlobalAddOptions(opts.commandArgs, opts.commandFlags));
  } else if (opts.command === 'bin') {
    await globalBin(toGlobalBinOptions(opts.commandArgs, opts.commandFlags));
  } else if (opts.command === 'list' || opts.command === 'ls' || typeof opts.command === 'undefined') {
    await globalList(toGlobalListOptions(opts.commandArgs, opts.commandFlags));
  } else if (opts.command === 'remove' || opts.command === 'rm') {
    await globalRemove(toGlobalRemoveOptions(opts.commandArgs, opts.commandFlags));
  } else if (opts.command === 'upgrade') {
    await globalUpgrade(toGlobalUpgradeOptions(opts.commandArgs, opts.commandFlags));
  } else {
    throw new PError(`You must specify a valid command to run in "pyarn global"`);
  }
}
