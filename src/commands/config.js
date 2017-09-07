// @flow
import * as options from '../utils/options';
import {PError} from '../utils/errors';

import {toConfigDeleteOptions, configDelete} from './config/delete';
import {toConfigGetOptions, configGet} from './config/get';
import {toConfigListOptions, configList} from './config/list';
import {toConfigSetOptions, configSet} from './config/set';

export type ConfigOptions = {
  command: string,
  commandArgs: options.Args,
  commandFlags: options.Flags
};

export function toConfigOptions(args: options.Args, flags: options.Flags): ConfigOptions {
  let [command, ...commandArgs] = args;
  return {
    command,
    commandArgs,
    commandFlags: flags,
  };
}

export async function config(opts: ConfigOptions) {
  if (opts.command === 'delete') {
    await configDelete(toConfigDeleteOptions(opts.commandArgs, opts.commandFlags));
  } else if (opts.command === 'get') {
    await configGet(toConfigGetOptions(opts.commandArgs, opts.commandFlags));
  } else if (opts.command === 'list' || opts.command === 'ls') {
    await configList(toConfigListOptions(opts.commandArgs, opts.commandFlags));
  } else if (opts.command === 'set') {
    await configSet(toConfigSetOptions(opts.commandArgs, opts.commandFlags));
  } else {
    throw new PError(`You must specify a valid command to run in "pyarn config"`);
  }
}
