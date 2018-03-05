// @flow
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';
const commands = {
  clean: require('./clean').cacheClean,
  dir: require('./dir').cacheDir,
  list: require('./list').cacheList,
  ls: require('./list').cacheList
};

export async function cache({ flags, subCommand, subCommandArgs }) {
  if (commands[subCommand]) {
    return await commands[subCommand]({ flags, subCommandArgs });
  }

  throw new BoltError(`Invalid subcommand. Try "ls, list, dir, clean"`);
}
