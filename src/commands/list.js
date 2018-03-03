// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';
import * as yarn from '../utils/yarn';

type ListOptions = {
  cwd?: string,
  pattern?: string,
  depth?: number | string
};

function toListOptions(args: options.Args, flags: options.Flags): ListOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    pattern: options.string(flags.pattern, 'pattern') || '',
    depth: options.number(flags.depth, 'depth') || ''
  };
}

export async function list(flags: options.Flags, args: Array<string>) {
  let opts = toListOptions(args, flags);
  let cwd = opts.cwd || process.cwd();
  let spawnArgs = opts.pattern ? [`--pattern=${opts.pattern}`] : [];
  if (opts.depth) {
    spawnArgs = spawnArgs.concat([`--depth=${opts.depth}`]);
  }
  try {
    yarn.cliCommand(cwd, 'list', spawnArgs);
  } catch (err) {
    throw new BoltError(err);
  }
}
