// @flow
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';
import * as yarn from '../../utils/yarn';

type ConfigCurrentOptions = {
  cwd?: string
};

function toConfigCurrentOptions(
  args: options.Args,
  flags: options.Flags
): ConfigCurrentOptions {
  return { cwd: options.string(flags.cwd, 'cwd') };
}

export async function configCurrent(flags: options.Flags, args: options.Args) {
  let opts = toConfigCurrentOptions(args, flags);
  let cwd = opts.cwd || process.cwd();
  try {
    await yarn.cliCommand(cwd, 'config', ['current']);
  } catch (err) {
    throw new BoltError(err);
  }
}
