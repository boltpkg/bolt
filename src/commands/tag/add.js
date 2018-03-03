// @flow
import * as options from '../../utils/options';
import * as yarn from '../../utils/yarn';
import { BoltError } from '../../utils/errors';

type TagAddOptions = {
  cwd?: string,
  args: Array<string>
};

function toTagAddOptions(
  args: options.Args,
  flags: options.Flags
): TagAddOptions {
  return { cwd: options.string(flags.cwd, 'cwd'), args };
}

export async function tagAdd(flags: options.Flags, args: options.Args) {
  let opts = toTagAddOptions(args, flags);
  let cwd = opts.cwd || process.cwd();
  try {
    await yarn.cliCommand(cwd, 'tag', ['add', ...opts.args]);
  } catch (err) {
    throw new BoltError(err);
  }
}
