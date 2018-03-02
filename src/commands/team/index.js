// @flow
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';

const commands = {
  ...require('./add'),
  ...require('./create'),
  ...require('./destroy'),
  ...require('./list'),
  ...require('./remove')
};

export async function team(
  flags: options.Flags,
  commandArgs: Array<string>,
  subCommand: string,
  subCommandArgs: Array<string>
) {
  if (commands[subCommand]) {
    return await commands[subCommand](flags, subCommandArgs);
  }

  throw new BoltError(
    `Invalid subcommand. Try "add, create, destroy, list or remove"`
  );
}
