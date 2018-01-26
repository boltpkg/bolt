// @flow
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';
import * as yarn from '../../utils/yarn';

export type TagListOptions = {
  cwd?: string,
  args: Array<string>
};

export function toTagListOptions(
  args: options.Args,
  flags: options.Flags
): TagListOptions {
  return { cwd: options.string(flags.cwd, 'cwd'), args };
}

export async function tagList(opts: TagListOptions) {
  let cwd = opts.cwd || process.cwd();
  let args = opts.args || [];

  try {
    await yarn.cliCommand(cwd, 'tag', ['list', ...args]);
  } catch (err) {
    throw new BoltError(err);
  }
}
