// @flow
import type { FilterOpts } from '../../types';
import Project from '../../Project';
import Package from '../../Package';
import * as options from '../../utils/options';
import * as messages from '../../utils/messages';
import { BoltError } from '../../utils/errors';
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

type WorkspacesUpgradeOptions = {
  cwd?: string,
  deps: Array<Dependency>,
  filterOpts: FilterOpts,
  flags: Array<string>
};

function toWorkspacesUpgradeOptions(
  args: options.Args,
  flags: options.Flags
): WorkspacesUpgradeOptions {
  let depsArgs = [];

  args.forEach(dep => {
    depsArgs.push(options.toDependency(dep));
  });

  return {
    cwd: options.string(flags.cwd, 'cwd'),
    deps: depsArgs,
    flags: toScriptFlags(flags),
    filterOpts: options.toFilterOpts(flags)
  };
}

export async function workspacesUpgrade(
  flags: options.Flags,
  args: options.Args
) {
  let opts = toWorkspacesUpgradeOptions(args, flags);
  let cwd = opts.cwd || process.cwd();
  let project = await Project.init(cwd);
  let pkg = await Package.closest(cwd);
  let filterOpts = Object.keys(opts.filterOpts);

  if (filterOpts.length) {
    throw new BoltError(messages.errorWorkspacesUpgrade(filterOpts));
  }

  try {
    await upgradeDependenciesInPackage(project, pkg, opts.deps, opts.flags);
  } catch (err) {
    throw new BoltError(`upgrading dependencies failed due to ${err}`);
  }
}
