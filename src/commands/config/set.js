// @flow
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';
import * as yarn from '../../utils/yarn';
import type { SubCommandArgsType } from '../../types';

type ConfigSetOptions = {
  cwd?: string,
  args: Array<string>
};

function toConfigSetOptions(
  args: options.Args,
  flags: options.Flags
): ConfigSetOptions {
  return { cwd: options.string(flags.cwd, 'cwd'), args };
}

export async function configSet({ flags, subCommandArgs }: SubCommandArgsType) {
  let opts = toConfigSetOptions(subCommandArgs, flags);
  let cwd = opts.cwd || process.cwd();
  try {
    await yarn.cliCommand(cwd, 'config', ['set', ...opts.args]);
  } catch (err) {
    throw new BoltError(err);
  }
}
