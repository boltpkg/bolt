// @flow
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';
const commands = {
  add: require('./add').projectAdd,
  exec: require('./exec').projectExec,
  remove: require('./remove').projectRemove,
  run: require('./run').projectRun,
  upgrade: require('./upgrade').projectUpgrade
};

async function project(
  flags: options.Flags,
  commandArgs: Array<string>,
  subCommand: string,
  subCommandArgs: Array<string>
) {
  if (commands[subCommand]) {
    return await commands[subCommand](flags, subCommandArgs);
  }

  throw new BoltError(
    `Invalid subcommand. Try "add, exec, remove, run or upgrade"`
  );
}

module.exports = {
  project,
  p: project
};
