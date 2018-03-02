// @flow
import * as options from '../../utils/options';

const commands = {
  ...require('./add')
};

async function workspace(
  flags: options.Flags,
  commandArgs: Array<string>,
  subCommand: string,
  subCommandArgs: Array<string>
) {
  let [workspaceCommand, ...rest] = subCommandArgs;
  let workspaceArgs = [subCommand, ...rest];
  await commands[workspaceCommand](flags, workspaceArgs);
}

module.exports = {
  workspace,
  ws: workspace
};
