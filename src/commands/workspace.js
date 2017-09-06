// @flow
import * as options from '../utils/options';
import {PError} from '../utils/errors';

import {toWorkspaceAddOptions, workspaceAdd} from './ws/add';
import {toWorkspaceRemoveOptions, workspaceRemove} from './ws/remove';
import {toWorkspaceRunOptions, workspaceRun} from './ws/run';
import {toWorkspaceUpgradeOptions, workspaceUpgrade} from './ws/upgrade';

export type WorkspaceOptions = {|
  command: string,
  workspace: string,
  commandArgs: options.Args,
  commandFlags: options.Flags
|};

export function toWorkspaceOptions(args: options.Args, flags: options.Flags): WorkspaceOptions {
  let [command, workspace, ...commandArgs] = args;
  return {
    command,
    workspace,
    commandArgs,
    commandFlags: flags,
  };
}

export async function workspace(opts: WorkspaceOptions) {
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
    throw new PError(`You must specify a command to run in "pyarn project"`);
  }
}
