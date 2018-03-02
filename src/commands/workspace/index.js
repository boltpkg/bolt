// @flow
import * as options from '../../utils/options';

/**
 * { add: [function], ... }
 */
const commands = {
  ...require('./add'),
  ...require('./exec'),
  ...require('./link'),
  ...require('./remove'),
  ...require('./run'),
  ...require('./unlink'),
  ...require('./upgrade')
};

async function workspace(
  flags: options.Flags,
  commandArgs: Array<string>,
  subCommand: string,
  subCommandArgs: Array<string>
) {
  let [workspaceCommand, ...rest] = subCommandArgs;
  let workspaceArgs = [subCommand, ...rest];
  return await commands[workspaceCommand](flags, workspaceArgs);
}

/**
 * Alias for workspace, can use workspace or ws
 */
module.exports = {
  workspace,
  w: workspace
};
