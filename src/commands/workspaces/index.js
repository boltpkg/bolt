// @flow
const command = {
  ...require('./add'),
  ...require('./exec'),
  ...require('./remove'),
  ...require('./run'),
  ...require('./upgrade')
};

async function workspaces(
  flags: options.Flags,
  commandArgs: Array<string>,
  subCommand: string,
  subCommandArgs: Array<string>
) {
  if (command[subCommand]) {
    return command[subCommand](flags, subCommandArgs);
  }

  return command['run'](flags, commandArgs);
}

/**
 * Alias for workspace, can use workspace or ws
 */
module.exports = {
  workspaces,
  ws: workspaces
};
