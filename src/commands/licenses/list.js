// @flow
import * as options from '../../utils/options';
import {PError} from '../../utils/errors';

export type LicensesListOptions = {};

export function toLicensesListOptions(args: options.Args, flags: options.Flags): LicensesListOptions {
  return {};
}

export async function licensesList(opts: LicensesListOptions) {
  throw new PError('Unimplemented command "licenses list"');
}
