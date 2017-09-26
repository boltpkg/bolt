// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';

export type ImportOptions = {};

export function toImportOptions(
  args: options.Args,
  flags: options.Flags
): ImportOptions {
  return {};
}

export async function import_(opts: ImportOptions) {
  throw new BoltError('Unimplemented command "import"');
}
