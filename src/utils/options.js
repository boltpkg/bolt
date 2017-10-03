// @flow

export type Args = Array<string>;

export type Flags = {
  '--'?: Array<string>,
  [key: string]: boolean | string
};

export function string(val: mixed, name: string): string | void {
  if (typeof val !== 'undefined' && typeof val !== 'string') {
    throw new Error(`Flag "${name}" must be string`);
  } else {
    return val;
  }
}

export function boolean(val: mixed, name: string): boolean | void {
  if (typeof val !== 'undefined' && typeof val !== 'boolean') {
    throw new Error(`Flag "${name}" must be boolean`);
  } else {
    return val;
  }
}

export function toFilterOpts(flags: Flags) {
  let filterOpts = {};

  if (flags.only) filterOpts.only = string(flags.only, 'only');
  if (flags.onlyFs) filterOpts.onlyFs = string(flags.onlyFs, 'onlyFs');
  if (flags.ignore) filterOpts.ignore = string(flags.ignore, 'ignore');
  if (flags.ignoreFs) filterOpts.ignoreFs = string(flags.ignoreFs, 'ignoreFs');

  return filterOpts;
}
