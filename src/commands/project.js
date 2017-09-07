// @flow
import * as options from '../utils/options';
import {PError} from '../utils/errors';

import {toProjectAddOptions, projectAdd} from './project/add';
import {toProjectRemoveOptions, projectRemove} from './project/remove';
import {toProjectRunOptions, projectRun} from './project/run';
import {toProjectUpgradeOptions, projectUpgrade} from './project/upgrade';

export type ProjectOptions = {|
  command: string,
  commandArgs: options.Args,
  commandFlags: options.Flags
|};

export function toProjectOptions(args: options.Args, flags: options.Flags): ProjectOptions {
  let [command, ...commandArgs] = args;
  return {
    command,
    commandArgs,
    commandFlags: flags,
  };
}

export async function project(opts: ProjectOptions) {
  if (opts.command === 'add') {
    await projectAdd(toProjectAddOptions(opts.commandArgs, opts.commandFlags));
  } else if (opts.command === 'remove') {
    await projectRemove(toProjectRemoveOptions(opts.commandArgs, opts.commandFlags));
  } else if (opts.command === 'run') {
    await projectRun(toProjectRunOptions(opts.commandArgs, opts.commandFlags));
  } else if (opts.command === 'upgrade') {
    await projectRemove(toProjectRemoveOptions(opts.commandArgs, opts.commandFlags));
  } else if (typeof opts.command !== 'undefined') {
    await projectRun(toProjectRunOptions([opts.command, ...opts.commandArgs], opts.commandFlags));
  } else {
    throw new PError(`You must specify a valid command to run in "pyarn project"`);
  }
}
