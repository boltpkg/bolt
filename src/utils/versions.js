// @flow
import * as semver from 'semver';
import * as messages from './messages';

export opaque type Version = string;

export type IncrementType =
  | 'patch'
  | 'minor'
  | 'major'
  | 'prepatch'
  | 'preminor'
  | 'premajor'
  | 'prerelease';

export const VERSION_TYPES = [
  'patch',
  'minor',
  'major',
  'prerelease',
  'prepatch',
  'preminor',
  'premajor'
];

export function toVersion(version: string): Version {
  if (semver.valid(version)) {
    return version;
  } else {
    throw new Error(
      `Invalid semver version: ${version} (See https://github.com/npm/node-semver)`
    );
  }
}

export function getPrereleaseType(version: Version): string | null {
  let parts = semver.prerelease(version);
  if (parts) return parts[0];
  return null;
}

export function increment(version: Version, type: IncrementType) {
  let prereleaseType = getPrereleaseType(version) || 'beta';
  return semver.inc(version, type, prereleaseType);
}

const MESSSAGES = {
  patch: ver => messages.patch(increment(ver, 'patch')),
  minor: ver => messages.minor(increment(ver, 'minor')),
  major: ver => messages.major(increment(ver, 'major')),
  prepatch: ver => messages.prepatch(increment(ver, 'prepatch')),
  preminor: ver => messages.preminor(increment(ver, 'preminor')),
  premajor: ver => messages.premajor(increment(ver, 'premajor')),
  prerelease: ver => messages.prerelease(increment(ver, 'prerelease'))
};

export function getIncrementMessage(
  currentVersion: Version,
  type: IncrementType
): messages.Message {
  return MESSSAGES[type](currentVersion);
}
