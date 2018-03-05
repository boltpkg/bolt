// @flow
import * as options from '../../utils/options';

const command = {
  add: require('./add').workspacesAdd,
  exec: require('./exec').workspacesExec,
  remove: require('./remove').workspacesRemove,
  run: require('./run').workspacesRun,
  upgrade: require('./upgrade').workspacesUpgrade
};

async function workspaces({ flags, subCommand, subCommandArgs }) {
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
