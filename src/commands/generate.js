// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';

type GenerateOptions = {};

function toGenerateOptions(
  args: options.Args,
  flags: options.Flags
): GenerateOptions {
  return {};
}

export async function generate(flags: options.Flags, args: Array<string>) {
  throw new BoltError('Unimplemented command "generate"');
}
