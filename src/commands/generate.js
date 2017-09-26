// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';

export type GenerateOptions = {};

export function toGenerateOptions(
  args: options.Args,
  flags: options.Flags
): GenerateOptions {
  return {};
}

export async function generate(opts: GenerateOptions) {
  throw new BoltError('Unimplemented command "generate"');
}
