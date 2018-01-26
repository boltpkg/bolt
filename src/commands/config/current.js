// @flow
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';
import * as yarn from '../../utils/yarn';

export type ConfigCurrentOptions = {
  cwd?: string
};

export function toConfigCurrentOptions(
  args: options.Args,
  flags: options.Flags
): ConfigCurrentOptions {
  return { cwd: options.string(flags.cwd, 'cwd') };
}

export async function configCurrent(opts: ConfigCurrentOptions) {
  let cwd = opts.cwd || process.cwd();
  try {
    await yarn.cliCommand(cwd, 'config', ['current']);
  } catch (err) {
    throw new BoltError(err);
  }
}
