// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';
import { run } from './run';

type BuildOptions = {};

function toBuildOptions(
  args: options.Args,
  flags: options.Flags
): BuildOptions {
  return {};
}

export async function build(flags: options.Flags, commandArgs: Array<string>) {
  return await run(flags, ['build', ...commandArgs]);
}
