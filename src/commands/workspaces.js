// @flow
import type {Args, Opts} from '../types';
import commands from './ws';

export default async function workspaces(args: Args, opts: Opts) {
  let [cmd, ...restArgs] = args;
  return await commands[cmd](restArgs, opts);
}
