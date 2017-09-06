// @flow
import * as options from '../utils/options';
import {PError} from '../utils/errors';

export type TestOptions = {};

export function toTestOptions(args: options.Args, flags: options.Flags): TestOptions {
  return {};
}

export async function test(opts: TestOptions) {
  throw new PError('Unimplemented command "test"');
}
