// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';
import * as yarn from '../utils/yarn';

export type ListOptions = {
  cwd?: string,
  pattern?: string,
  depth?: number | string
};

export function toListOptions(
  args: options.Args,
  flags: options.Flags
): ListOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    pattern: options.string(flags.pattern, 'pattern') || '',
    depth: options.number(flags.depth, 'depth') || ''
  };
}

export async function list(opts: ListOptions) {
  let cwd = opts.cwd || process.cwd();
  let args = opts.pattern ? [`--pattern=${opts.pattern}`] : [];
  if (opts.depth) {
    args = args.concat([`--depth=${opts.depth}`]);
  }
  try {
    yarn.cliCommand(cwd, 'list', args);
  } catch (err) {
    throw new BoltError(err);
  }
}
