// @flow
import * as options from '../../utils/options';
import * as yarn from '../../utils/yarn';
import { BoltError } from '../../utils/errors';

export type TagRemoveOptions = {
  cwd?: string,
  args: Array<string>
};

export function toTagRemoveOptions(
  args: options.Args,
  flags: options.Flags
): TagRemoveOptions {
  return { cwd: options.string(flags.cwd, 'cwd'), args };
}

export async function tagRemove(opts: TagRemoveOptions) {
  let cwd = opts.cwd || process.cwd();
  try {
    await yarn.cliCommand(cwd, 'tag', ['remove', ...opts.args]);
  } catch (err) {
    throw new BoltError(err);
  }
}
