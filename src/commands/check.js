// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';
import { run } from './run';

type CheckOptions = {};

function toCheckOptions(
  args: options.Args,
  flags: options.Flags
): CheckOptions {
  return {};
}

export async function check(flags: options.Flags, args: Array<string>) {
  return await run(flags, ['check', ...args]);
}
