// @flow
import * as options from '../../utils/options';
import * as yarn from '../../utils/yarn';
import type { Dependency } from '../../types';
import { BoltError } from '../../utils/errors';

type GlobalAddOptions = {
  deps: Array<Dependency>
};

function toGlobalAddOptions(
  args: options.Args,
  flags: options.Flags
): GlobalAddOptions {
  const depsArgs = [];

  // args is each of our dependencies we are adding which may have "@version" parts to them
  args.forEach(dep => {
    depsArgs.push(options.toDependency(dep));
  });

  return {
    deps: depsArgs
  };
}

export async function globalAdd(flags: options.Flags, args: options.Args) {
  let opts = toGlobalAddOptions(args, flags);
  try {
    await yarn.globalCli('add', opts.deps);
  } catch (err) {
    throw new BoltError(err);
  }
}
