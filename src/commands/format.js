// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';
import { run } from './run';

type FormatOptions = {};

function toFormatOptions(
  args: options.Args,
  flags: options.Flags
): FormatOptions {
  return {};
}

export async function format(flags: options.Flags, args: Array<string>) {
  return await run(flags, ['format', ...args]);
}
