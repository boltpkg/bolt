// @flow
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';
const commands = {
  add: require('./add').globalAdd,
  bin: require('./bin').globalBin,
  list: require('./list').globalList,
  remove: require('./remove').globalRemove,
  upgrade: require('./upgrade').globalUpgrade
};

export async function global(
  flags: options.Flags,
  commandArgs: Array<string>,
  subCommand: string,
  subCommandArgs: Array<string>
) {
  if (commands[subCommand]) {
    return await commands[subCommand](flags, subCommandArgs);
  }

  throw new BoltError(
    `Invalid subcommand. Try "add, bin, list, remove or upgrade"`
  );
}
