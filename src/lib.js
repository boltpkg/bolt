// @flow
import type {Args, Opts} from './types';
import * as commands from './commands/index';
import * as logger from './utils/logger';

export default async function pyarn(cmd: string, args: Args, opts: Opts) {
  let command = commands[cmd];

  if (!command) {
    throw new Error(`${cmd} is not a valid pyarn command`);
  }

  return await commands[cmd](args, opts);
}
