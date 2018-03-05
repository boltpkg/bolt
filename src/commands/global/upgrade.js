// @flow
import * as options from '../../utils/options';
import * as yarn from '../../utils/yarn';
import type { Dependency } from '../../types';
import { BoltError } from '../../utils/errors';
import type { SubCommandArgsType } from '../../types';

type GlobalUpgradeOptions = {
  deps: Array<Dependency>
};

function toGlobalUpgradeOptions(
  args: options.Args,
  flags: options.Flags
): GlobalUpgradeOptions {
  const depsArgs = [];

  // args is each of our dependencies we are adding which may have "@version" parts to them
  args.forEach(dep => {
    depsArgs.push(options.toDependency(dep));
  });

  return {
    deps: depsArgs
  };
}

export async function globalUpgrade({
  flags,
  subCommandArgs
}: SubCommandArgsType) {
  let opts = toGlobalUpgradeOptions(subCommandArgs, flags);
  try {
    await yarn.globalCli('upgrade', opts.deps);
  } catch (err) {
    throw new BoltError(err);
  }
}
