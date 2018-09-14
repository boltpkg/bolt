// @flow

export type DependencySet = {
  [key: string]: string
};

export type Scripts = {
  [script: string]: string
};

export type JSONValue =
  | null
  | string
  | boolean
  | number
  | Array<JSONValue>
  | { [key: string]: JSONValue };

export type SpawnOpts = {
  orderMode?: 'serial' | 'parallel'
  // maxConcurrent?: number,
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
