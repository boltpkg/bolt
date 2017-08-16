// @flow
import type {Args, Opts} from './types';
import * as commands from './commands/index';

export default async function pyarn(cmd: string, args: Args, opts: Opts) {
  return await commands[cmd](args, opts);
}
