// @flow
import * as options from '../../utils/options';
import * as yarn from '../../utils/yarn';
import { BoltError } from '../../utils/errors';

type TagRemoveOptions = {
  cwd?: string,
  args: Array<string>
};

function toTagRemoveOptions(
  args: options.Args,
  flags: options.Flags
): TagRemoveOptions {
  return { cwd: options.string(flags.cwd, 'cwd'), args };
}

export async function tagRemove(flags: options.Flags, args: options.Args) {
  let opts = toTagRemoveOptions(args, flags);
  let cwd = opts.cwd || process.cwd();
  try {
    await yarn.cliCommand(cwd, 'tag', ['remove', ...opts.args]);
  } catch (err) {
    throw new BoltError(err);
  }
}
