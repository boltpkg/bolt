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

export type FilterOpts = {
  only?: string,
  ignore?: string,
  onlyFs?: string,
  ignoreFs?: string
};
