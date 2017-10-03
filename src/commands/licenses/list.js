// @flow
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';

export type LicensesListOptions = {};

export function toLicensesListOptions(
  args: options.Args,
  flags: options.Flags
): LicensesListOptions {
  return {};
}

export async function licensesList(opts: LicensesListOptions) {
  throw new BoltError('Unimplemented command "licenses list"');
}
