// @flow
import * as options from '../../utils/options';

const commands = {
  add: require('./add').workspaceAdd,
  exec: require('./exec').workspaceExec,
  link: require('./link').workspaceLink,
  remove: require('./remove').workspaceRemove,
  run: require('./run').workspaceRun,
  unlink: require('./unlink').workspaceUnlink,
  upgrade: require('./upgrade').workspaceUpgrade
};

async function workspace({ flags, subCommand, subCommandArgs }) {
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
