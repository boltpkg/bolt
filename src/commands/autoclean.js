// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';
import * as yarn from '../utils/yarn';

export type AutocleanOptions = {
  cwd?: string
};

export function toAutocleanOptions(
  args: options.Args,
  flags: options.Flags
): AutocleanOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd')
  };
}

export async function autoclean(opts: AutocleanOptions) {
  let cwd = opts.cwd || process.cwd();

  try {
    await yarn.cliCommand(cwd, 'autoclean');
  } catch (err) {
    throw new BoltError(err);
  }
}
