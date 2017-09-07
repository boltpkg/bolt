// @flow
import * as options from '../utils/options';
import {PError} from '../utils/errors';

import {toWorkspaceAddOptions, workspaceAdd} from './ws/add';
import {toWorkspaceRemoveOptions, workspaceRemove} from './ws/remove';
import {toWorkspaceRunOptions, workspaceRun} from './ws/run';
import {toWorkspaceUpgradeOptions, workspaceUpgrade} from './ws/upgrade';

export type WorkspacesOptions = {|
  command: string,
  commandArgs: options.Args,
  commandFlags: options.Flags
|};

export function toWorkspacesOptions(args: options.Args, flags: options.Flags): WorkspacesOptions {
  let [command, ...commandArgs] = args;
  return {
    command,
    commandArgs,
    commandFlags: flags,
  };
}

export async function workspaces(opts: WorkspacesOptions) {
  if (opts.command === 'add') {
    await workspaceAdd(toWorkspaceAddOptions(opts.commandArgs, opts.commandFlags));
  } else if (opts.command === 'remove') {
    await workspaceRemove(toWorkspaceRemoveOptions(opts.commandArgs, opts.commandFlags));
  } else if (opts.command === 'run') {
    await workspaceRun(toWorkspaceRunOptions(opts.commandArgs, opts.commandFlags));
  } else if (opts.command === 'upgrade') {
    await workspaceRemove(toWorkspaceRemoveOptions(opts.commandArgs, opts.commandFlags));
  } else if (typeof opts.command !== 'undefined') {
    await workspaceRun(toWorkspaceRunOptions([opts.command, ...opts.commandArgs], opts.commandFlags));
  } else {
    throw new PError(`You must specify a valid command to run in "pyarn workspaces"`);
  }
}
