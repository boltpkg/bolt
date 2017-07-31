// @flow

export type Args = Array<string>;
export type Opts = { [flag: string]: string | boolean };

export type DependencySet = {
  [key: string]: string
};

export type Scripts = {
  [script: string]: string,
};

export type Config = {
  name: string,
  version: string,
  dependencies?: DependencySet,
  devDependencies?: DependencySet,
  peerDependencies?: DependencySet,
  optionalDependencies?: DependencySet,
  bundledDependencies?: DependencySet,
  pworkspaces?: Array<string>,
  scripts?: Scripts,
};
