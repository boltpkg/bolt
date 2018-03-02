// @flow
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';
const commands = {
  ...require('./add'),
  ...require('./list'),
  ...require('./remove')
};

async function owner(
  flags: options.Flags,
  commandArgs: Array<string>,
  subCommand: string,
  subCommandArgs: Array<string>
) {
  if (commands[subCommand]) {
    return await commands[subCommand](flags, subCommandArgs);
  }

  throw new BoltError(`Invalid subcommand. Try "generate-disclaimer or list"`);
}

module.exports = {
  owner,
  o: owner
};
