// @flow
import * as options from '../utils/options';
import {PError} from '../utils/errors';

export type CreateOptions = {};

export function toCreateOptions(args: options.Args, flags: options.Flags): CreateOptions {
  return {};
}

export async function create(opts: CreateOptions) {
  throw new PError('Unimplemented command "create"');
}
