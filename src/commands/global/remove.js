// @flow
import * as options from '../../utils/options';
import * as yarn from '../../utils/yarn';
import type { Dependency } from '../../types';
import { BoltError } from '../../utils/errors';

type GlobalRemoveOptions = {
  deps: Array<Dependency>
};

function toGlobalRemoveOptions(
  args: options.Args,
  flags: options.Flags
): GlobalRemoveOptions {
  const depsArgs = [];

  // args is each of our dependencies we are adding which may have "@version" parts to them
  args.forEach(dep => {
    depsArgs.push(options.toDependency(dep));
  });

  return {
    deps: depsArgs
  };
}

export async function remove(flags: options.Flags, args: options.Args) {
  let opts = await toGlobalRemoveOptions(args, flags);
  try {
    await yarn.globalCli('remove', opts.deps);
  } catch (err) {
    throw new BoltError(err);
  }
}
