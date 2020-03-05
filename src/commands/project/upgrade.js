// @flow
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';
import Project from '../../Project';
import type { Dependency } from '../../types';
import upgradeDependenciesInPackage from '../../utils/upgradeDependenciesInPackages';

// TODO: pass flags individially, upgrade has many flags this is here for testing
function toScriptFlags(flags: options.Flags) {
  let scriptFlags = [];

  Object.keys(flags).map(flag => {
    if (flag === '--') return;
    if (typeof flags[flag] === 'string') {
      scriptFlags.push(`--${flag}=${flags[flag]}`);
    } else {
      scriptFlags.push(`--${flag}`);
    }
  });

  return scriptFlags;
}

export type ProjectUpgradeOptions = {
  cwd?: string,
  deps: Array<Dependency>,
  flags: Array<string>
};

export function toProjectUpgradeOptions(
  args: options.Args,
  flags: options.Flags
): ProjectUpgradeOptions {
  let depsArgs = [];

  args.forEach(dep => {
    depsArgs.push(options.toDependency(dep));
  });

  return {
    cwd: options.string(flags.cwd, 'cwd'),
    deps: depsArgs,
    flags: toScriptFlags(flags)
  };
}

export async function projectUpgrade(opts: ProjectUpgradeOptions) {
  let cwd = opts.cwd || process.cwd();
  let project = await Project.init(cwd);

  try {
    await upgradeDependenciesInPackage(
      project,
      project.pkg,
      opts.deps,
      opts.flags
    );
  } catch (err) {
    throw new BoltError(`upgrading dependencies failed due to ${err}`);
  }
}
