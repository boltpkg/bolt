// @flow
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';
const commands = {
  ...require('./add'),
  ...require('./exec'),
  ...require('./remove'),
  ...require('./run'),
  ...require('./upgrade')
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
