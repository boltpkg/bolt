// @flow
import type {Args, Opts} from './types';
import commands from './commands';

export default async function plerna(cmd: string, args: Args, opts: Opts) {
  return await commands[cmd](args, opts);
}
