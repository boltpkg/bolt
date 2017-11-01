// @flow
import pkgUp from 'pkg-up';
const boltPkgPath = pkgUp.sync(__dirname);

// $FlowFixMe
const boltPkg = require(boltPkgPath);

export const DEPENDENCY_TYPES = [
  'dependencies',
  'devDependencies',
  'peerDependencies',
  'bundledDependencies',
  'optionalDependencies'
];

export const DEPENDENCY_TYPE_FLAGS_MAP = {
  dev: 'devDependencies',
  peer: 'peerDependencies',
  optional: 'optionalDependencies',
  D: 'devDependencies',
  P: 'peerDependencies',
  O: 'optionalDependencies'
};

export const BOLT_VERSION = boltPkg.version;
