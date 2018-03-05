// @flow
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';
import * as yarn from '../../utils/yarn';
import type { SubCommandArgsType } from '../../types';

type TagListOptions = {
  cwd?: string,
  args: Array<string>
};

function toTagListOptions(
  args: options.Args,
  flags: options.Flags
): TagListOptions {
  return { cwd: options.string(flags.cwd, 'cwd'), args };
}

export async function tagList({ flags, subCommandArgs }: SubCommandArgsType) {
  let opts = toTagListOptions(subCommandArgs, flags);
  let cwd = opts.cwd || process.cwd();

  try {
    await yarn.cliCommand(cwd, 'tag', ['list', ...opts.args]);
  } catch (err) {
    throw new BoltError(err);
  }
}
