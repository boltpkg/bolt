// @flow
const command = {
  add: require('./add').add,
  exec: require('./exec').workspacesExec,
  remove: require('./remove').workspacesRemove,
  run: require('./run').workspacesRun,
  upgrade: require('./upgrade').workspacesUpgrade
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
 * Alias for workspaces, can use workspaces or ws
 */
module.exports = {
  workspaces,
  ws: workspaces
};
