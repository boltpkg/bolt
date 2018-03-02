// @flow
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';
const commands = {
  ...require('./current'),
  ...require('./get'),
  ...require('./list'),
  ...require('./set'),
  delete: require('./delete').delete_
};

export async function config(
  flags: options.Flags,
  commandArgs: Array<string>,
  subCommand: string,
  subCommandArgs: Array<string>
) {
  if (commands[subCommand]) {
    return await commands[subCommand](flags, subCommandArgs);
  }

  throw new BoltError(
    `Invalid subcommand. Try "current, delete, get, list or set"`
  );
}
