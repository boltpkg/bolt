// @flow
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';
import * as yarn from '../../utils/yarn';

export type ConfigGetOptions = {
  cwd?: string,
  args: Array<string>
};

export function toConfigGetOptions(
  args: options.Args,
  flags: options.Flags
): ConfigGetOptions {
  return { cwd: options.string(flags.cwd, 'cwd'), args };
}

export async function configGet(opts: ConfigGetOptions) {
  let cwd = opts.cwd || process.cwd();
  try {
    await yarn.cliCommand(cwd, 'config', ['get', ...opts.args]);
  } catch (err) {
    throw new BoltError(err);
  }
}
