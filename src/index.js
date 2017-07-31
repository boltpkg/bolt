// @flow
import type {Args, Opts} from './types';

import install from './commands/install';

import add from './commands/add';
import upgrade from './commands/upgrade';
import remove from './commands/remove';

import exec from './commands/exec';
import run from './commands/run';

import publish from './commands/publish';

const commands = {
  install: install,
  add: add,
  upgrade: upgrade,
  remove: remove,
  exec: exec,
  run: run,
  publish: publish,
};

export default async function plerna(cmd: string, args: Args, opts: Opts) {
  return await commands[cmd](args, opts);
}
