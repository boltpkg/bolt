// @flow
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';
import * as yarn from '../../utils/yarn';

type ConfigListOptions = {
  cwd?: string
};

function toConfigListOptions(
  args: options.Args,
  flags: options.Flags
): ConfigListOptions {
  if (args.length !== 0) {
    throw new BoltError('Invalid subcommand, try bolt config list');
  }
  return { cwd: options.string(flags.cwd, 'cwd') };
}

export async function configList(flags: options.Flags, args: options.Args) {
  let opts = toConfigListOptions(args, flags);
  let cwd = opts.cwd || process.cwd();
  try {
    await yarn.cliCommand(cwd, 'config', ['list']);
  } catch (err) {
    throw new BoltError(err);
  }
}
