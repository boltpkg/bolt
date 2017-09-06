// @flow
import * as options from '../utils/options';
import Project from '../Project';
import * as processes from '../utils/processes';
import * as fs from '../utils/fs';
import * as path from 'path';
import * as logger from '../utils/logger';
import * as messages from '../utils/messages';
import * as semver from 'semver';
import * as npm from '../utils/npm';
import chalk from 'chalk';

export type NormalizeOptions = {|
  cwd?: string,
|};

export function toNormalizeOptions(args: options.Args, flags: options.Flags): NormalizeOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd'),
  };
}

function getWorkspaceMap(workspaces) {
  let workspaceMap = new Map();

  for (let workspace of workspaces) {
    workspaceMap.set(workspace.pkg.config.name, workspace);
  }

  return workspaceMap;
}

function getPackageDependencyMap(project, projectDependencies, workspaces) {
  let map = new Map();
  map.set(project.pkg, projectDependencies);
  for (let workspace of workspaces) {
    map.set(workspace.pkg, workspace.pkg.getAllDependencies());
  }
  return map;
}

function getAllDependencies(packageDependencyMap) {
  let allDependencies = new Map();

  for (let [pkg, packageDependencies] of packageDependencyMap) {
    for (let [dependency, version] of packageDependencies) {
      let versionMap = allDependencies.get(dependency);

      if (!versionMap) {
        versionMap = new Map();
        allDependencies.set(dependency, versionMap);
      }

      let packageSet = versionMap.get(version);

      if (!packageSet) {
        packageSet = new Set();
        versionMap.set(version, packageSet);
      }

      packageSet.add(pkg);
    }
  }

  return allDependencies;
}

async function getInfoForPackageNames(pkgNames) {
  let info = {};

  await Promise.all(pkgNames.map(async pkgName => {
    info[pkgName] = await npm.info(pkgName);
  }));

  return info;
}

function getHighestVersionForRanges(versions, ranges) {
  let filtered = ranges.reduce((filteredVersions, range) => {
    return filteredVersions.filter(version => {
      return semver.satisfies(version, range);
    });
  }, versions);

  if (filtered.length === 0) {
    return null;
  }

  return filtered[filtered.length - 1];
}

function getMaxPackageNameLength(pkgNames) {
  return pkgNames.reduce((curr, pkgName) => {
    return Math.max(curr, pkgName.length);
  }, 0);
}

export async function normalize(opts: NormalizeOptions) {
  let cwd = opts.cwd || process.cwd();
  let project = await Project.init(cwd);
  let workspaces = await project.getWorkspaces();

  let workspaceMap = getWorkspaceMap(workspaces);

  let projectDependencies = project.pkg.getAllDependencies();
  let packageDependencyMap = getPackageDependencyMap(project, projectDependencies, workspaces);
  let allDependencies = getAllDependencies(packageDependencyMap);

  let finalVersions = new Map();

  let unmatched = [];

  for (let [depName, versionMap] of allDependencies) {
    if (versionMap.size === 1) {
      finalVersions.set(depName, Array.from(versionMap.keys())[0]);
    } else {
      unmatched.push(depName);
    }
  }

  let unmatchedInfo = await getInfoForPackageNames(unmatched);

  for (let depName of unmatched) {
    let versionMap = allDependencies.get(depName);
    if (!versionMap) continue;

    let versionRanges = Array.from(versionMap.keys());
    let validVersions: Array<string> = unmatchedInfo[depName].versions;

    let highest = getHighestVersionForRanges(validVersions, versionRanges);
    if (!highest) continue;

    let newVersion = '^' + highest;

    for (let [pkg, packageDependencies] of packageDependencyMap) {
      let prevVersion = packageDependencies.get(depName);
      let depType = pkg.getDependencyType(depName);

      if (prevVersion && depType) {
        await pkg.updateDependencyVersionRange(depName, depType, newVersion);
      }
    }

    finalVersions.set(depName, newVersion);
  }

  for (let [depName] of allDependencies) {
    let finalVersion = finalVersions.get(depName);
    let depType = project.pkg.getDependencyType(depName) || 'dependencies';

    let isWorkspace = workspaceMap.has(depName);
    let isUpdating = projectDependencies.has(depName);

    if (finalVersion && (isWorkspace ? isUpdating : true)) {
      await project.pkg.updateDependencyVersionRange(depName, depType, finalVersion);
    }
  }

  let outputItems = [];

  let maxLength = getMaxPackageNameLength(unmatched);
  let padding = ' '.repeat(maxLength + 1);

  for (let depName of unmatched) {
    let versionMap = allDependencies.get(depName);
    let finalVersion = finalVersions.get(depName);

    if (versionMap && !finalVersion) {
      let outputItem = chalk.red(depName.padStart(maxLength));

      for (let [version, packages] of versionMap) {
        let pkgs = Array.from(packages).map(pkg => {
          return chalk.cyan(pkg.config.name);
        });

        outputItem += '\n';
        outputItem += version.padStart(maxLength);
        outputItem += ' ' + pkgs.join('\n' + padding);
      }

      outputItems.push(outputItem);
    }
  }

  logger.error('The following packages could not be normalized:');
  logger.log(outputItems.join('\n\n'));
}
