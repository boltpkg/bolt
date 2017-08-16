// @flow
import type {Args, Opts} from '../types';
import * as commands from './ws/index';

export default async function workspaces(args: Args, opts: Opts) {
  let [cmd, ...restArgs] = args;
  return await commands[cmd](restArgs, opts);
}
