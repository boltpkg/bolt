// @flow
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';
import * as yarn from '../../utils/yarn';

export type ConfigDeleteOptions = {
  cwd?: string,
  args: Array<string>
};

export function toConfigDeleteOptions(
  args: options.Args,
  flags: options.Flags
): ConfigDeleteOptions {
  return { cwd: options.string(flags.cwd, 'cwd'), args };
}

export async function configDelete(opts: ConfigDeleteOptions) {
  let cwd = opts.cwd || process.cwd();
  try {
    await yarn.cliCommand(cwd, 'config', ['delete', ...opts.args]);
  } catch (err) {
    throw new BoltError(err);
  }
}
