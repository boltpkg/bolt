// @flow
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';
const commands = {
  add: require('./add').ownerAdd,
  list: require('./list').ownerList,
  remove: require('./remove').ownerRemove
};

async function owner({ flags, subCommand, subCommandArgs }) {
  if (commands[subCommand]) {
    return await commands[subCommand](flags, subCommandArgs);
  }

  throw new BoltError(`Invalid subcommand. Try "generate-disclaimer or list"`);
}

module.exports = {
  owner,
  o: owner
};
