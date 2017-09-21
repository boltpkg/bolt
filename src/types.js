// @flow

export type DependencySet = {
  [key: string]: string
};

export type Scripts = {
  [script: string]: string
};

export type Config = {
  name: string,
  version: string,
  private?: boolean,
  dependencies?: DependencySet,
  devDependencies?: DependencySet,
  peerDependencies?: DependencySet,
  optionalDependencies?: DependencySet,
  bundledDependencies?: DependencySet,
  pworkspaces?: Array<string>,
  scripts?: Scripts
};

export type FilterOpts = {
  only?: string,
  ignore?: string,
  onlyFs?: string,
  ignoreFs?: string
};

export type Dependency = {
  name: string,
  version?: string
};

export type configDependencyType =
  | 'dependencies'
  | 'devDependencies'
  | 'peerDependencies'
  | 'optionalDependencies';
