// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';
import { run } from './run';

type TestOptions = {};

function toTestOptions(args: options.Args, flags: options.Flags): TestOptions {
  return {};
}

export async function test(flags: options.Flags, commandArgs: Array<string>) {
  return await run(flags, ['test', ...commandArgs]);
}
