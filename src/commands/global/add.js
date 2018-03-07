// @flow
import * as options from '../../utils/options';
import * as yarn from '../../utils/yarn';
import type { Dependency } from '../../types';
import { BoltError } from '../../utils/errors';

export type GlobalAddOptions = {
  deps: Array<Dependency>
};

export function toGlobalAddOptions(
  args: options.Args,
  flags: options.Flags
): GlobalAddOptions {
  let depsArgs = [];

  // args is each of our dependencies we are adding which may have "@version" parts to them
  args.forEach(dep => {
    depsArgs.push(options.toDependency(dep));
  });

  return {
    deps: depsArgs
  };
}

export async function globalAdd(opts: GlobalAddOptions) {
  try {
    await yarn.globalCli('add', opts.deps);
  } catch (err) {
    throw new BoltError(err);
  }
}
