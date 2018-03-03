// @flow
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';
const commands = {
  current: require('./current').configCurrent,
  delete: require('./delete').configDelete,
  get: require('./get').configGet,
  list: require('./list').configList,
  set: require('./set').configSet
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
