// @flow
import * as options from '../utils/options';
import {PError} from '../utils/errors';

export type LintOptions = {};

export function toLintOptions(args: options.Args, flags: options.Flags): LintOptions {
  return {};
}

export async function lint(opts: LintOptions) {
  throw new PError('Unimplemented command "lint"');
}
