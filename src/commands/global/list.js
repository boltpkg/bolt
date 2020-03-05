// @flow
import * as options from '../../utils/options';
import * as yarn from '../../utils/yarn';
import { BoltError } from '../../utils/errors';

export type GlobalListOptions = {
  cwd?: string,
  args: Array<string>
};

export function toGlobalListOptions(
  args: options.Args,
  flags: options.Flags
): GlobalListOptions {
  return { cwd: options.string(flags.cwd, 'cwd'), args };
}

export async function globalList(opts: GlobalListOptions) {
  let cwd = opts.cwd || process.cwd();
  let args = opts.args || [];
  try {
    await yarn.cliCommand(cwd, 'global', ['list', ...opts.args]);
  } catch (err) {
    throw new BoltError(err);
  }
}
