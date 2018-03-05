// @flow
import * as options from '../utils/options';
import * as npm from '../utils/npm';
import { BoltError } from '../utils/errors';
import type { CommandArgsType } from '../types';

type LoginOptions = {|
  cwd?: string
|};

function toLoginOptions(
  args: options.Args,
  flags: options.Flags
): LoginOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd')
  };
}

export async function login({ commandArgs, flags }: CommandArgsType) {
  const opts = toLoginOptions(commandArgs, flags);
  let cwd = opts.cwd || process.cwd();
  try {
    await npm.login(cwd);
  } catch (err) {
    throw new BoltError(err);
  }
}
