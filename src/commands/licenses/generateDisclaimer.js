// @flow
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';

export type LicensesGenerateDisclaimerOptions = {};

export function toLicensesGenerateDisclaimerOptions(
  args: options.Args,
  flags: options.Flags
): LicensesGenerateDisclaimerOptions {
  return {};
}

export async function licensesGenerateDisclaimer(
  opts: LicensesGenerateDisclaimerOptions
) {
  throw new BoltError('Unimplemented command "licenses generate-disclaimer"');
}
