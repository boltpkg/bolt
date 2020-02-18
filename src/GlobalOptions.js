/**
 * Singleton that manages global bolt options.
 */

import * as options from './utils/options';

export type GlobalOptions = {
  disableCmdPrefix?: boolean
};
class GlobalOptionsStore {
  store = {
    disableCmdPrefix: undefined
  };
  set(key: $Keys<GlobalOptions>, value: $PropertyType<GlobalOptions, key>) {
    this.store[key] = value;
  }
  get(key: $Keys<GlobalOptions>): $PropertyType<GlobalOptions, key> {
    return this.store[key];
  }
  getAll(): GlobalOptions {
    return this.store;
  }
  setFromFlags(flags: options.Flags) {
    if (flags.prefix === false) {
      this.set('disableCmdPrefix', true);
    }
  }
}

export const globalOptions = new GlobalOptionsStore();
