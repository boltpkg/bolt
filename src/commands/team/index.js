// @flow
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';

const commands = {
  add: require('./add').teamAdd,
  create: require('./create').teamCreate,
  destroy: require('./destroy').teamDestroy,
  list: require('./list').teamList,
  remove: require('./remove').teamRemove
};

export async function team({ flags, subCommand, subCommandArgs }) {
  if (commands[subCommand]) {
    return await commands[subCommand](flags, subCommandArgs);
  }

  throw new BoltError(
    `Invalid subcommand. Try "add, create, destroy, list or remove"`
  );
}
