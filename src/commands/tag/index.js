// @flow
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';
const commands = {
  add: require('./add').tagAdd,
  list: require('./list').tagList,
  remove: require('./remove').tagRemove
};

export async function tag({ flags, subCommand, subCommandArgs }) {
  if (commands[subCommand]) {
    return await commands[subCommand](flags, subCommandArgs);
  }

  throw new BoltError(`Invalid subcommand. Try "add, list, or remove"`);
}
