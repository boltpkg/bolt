// @flow
import * as options from '../utils/options';
import { BoltError } from '../utils/errors';
import Project from '../Project';
import Package from '../Package';
import type { Dependency } from '../types';
import upgradeDependenciesInPackage from '../utils/upgradeDependenciesInPackages';

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

export type UpgradeOptions = {
  cwd?: string,
  deps: Array<Dependency>,
  flags: Array<string>
};

export function toUpgradeOptions(
  args: options.Args,
  flags: options.Flags
): UpgradeOptions {
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

export async function upgrade(opts: UpgradeOptions) {
  let cwd = opts.cwd || process.cwd();
  let project = await Project.init(cwd);
  let pkg = await Package.closest(cwd);

  try {
    await upgradeDependenciesInPackage(project, pkg, opts.deps, opts.flags);
  } catch (err) {
    throw new BoltError(`upgrading dependencies failed due to ${err}`);
  }
}
