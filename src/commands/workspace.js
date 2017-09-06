// @flow
import type {Args, Opts} from '../types';
import * as commands from './ws/index';

export default async function workspace(args: Args, opts: Opts) {
  let [cmd, workspaceName, ...restArgs] = args;

  return await commands[cmd](restArgs, opts);
}
