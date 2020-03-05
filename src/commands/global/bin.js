// @flow
import * as options from '../../utils/options';
import * as yarn from '../../utils/yarn';
import { BoltError } from '../../utils/errors';

export type GlobalBinOptions = {
  cwd?: string
};

export function toGlobalBinOptions(
  args: options.Args,
  flags: options.Flags
): GlobalBinOptions {
  return { cwd: options.string(flags.cwd, 'cwd') };
}

export async function globalBin(opts: GlobalBinOptions) {
  let cwd = opts.cwd || process.cwd();
  try {
    await yarn.cliCommand(cwd, 'global', ['bin']);
  } catch (err) {
    throw new BoltError(err);
  }
}
