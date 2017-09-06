// @flow
import * as options from '../utils/options';
import {PError} from '../utils/errors';

export type BuildOptions = {};

export function toBuildOptions(args: options.Args, flags: options.Flags): BuildOptions {
  return {};
}

export async function build(opts: BuildOptions) {
  throw new PError('Unimplemented command "build"');
}
