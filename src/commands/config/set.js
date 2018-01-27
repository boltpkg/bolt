// @flow
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';
import * as yarn from '../../utils/yarn';

export type ConfigSetOptions = {
  cwd?: string,
  args: Array<string>
};

export function toConfigSetOptions(
  args: options.Args,
  flags: options.Flags
): ConfigSetOptions {
  return { cwd: options.string(flags.cwd, 'cwd'), args };
}

export async function configSet(opts: ConfigSetOptions) {
  let cwd = opts.cwd || process.cwd();
  try {
    await yarn.cliCommand(cwd, 'config', ['set', ...opts.args]);
  } catch (err) {
    throw new BoltError(err);
  }
}
