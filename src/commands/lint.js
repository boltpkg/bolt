// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';
import { run } from './run';

type LintOptions = {};

function toLintOptions(args: options.Args, flags: options.Flags): LintOptions {
  return {};
}

export async function lint(flags: options.Flags, args: Array<string>) {
  return await run(flags, ['lint', ...args]);
}
