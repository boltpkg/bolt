// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';
import { run } from './run';

type DocOptions = {};

function toDocOptions(args: options.Args, flags: options.Flags): DocOptions {
  return {};
}

export async function doc(flags: options.Flags, args: Array<string>) {
  await run(flags, ['doc', ...args]);
}
