// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';
import * as yarn from '../utils/yarn';
import type { CommandArgsType } from '../types';

type WhyOptions = {
  cwd?: string,
  args: Array<string>
};

function toWhyOptions(args: options.Args, flags: options.Flags): WhyOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd'),
    args
  };
}

export async function why({ commandArgs, flags }: CommandArgsType) {
  let opts = toWhyOptions(commandArgs, flags);
  let cwd = opts.cwd || process.cwd();
  try {
    await yarn.cliCommand(cwd, 'why', opts.args);
  } catch (err) {
    throw new BoltError(err);
  }
}
