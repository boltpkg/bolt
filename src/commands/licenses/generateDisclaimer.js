// @flow
import * as options from '../../utils/options';
import * as yarn from '../../utils/yarn';

export type LicensesGenerateDisclaimerOptions = {
  cwd?: string
};

export function toLicensesGenerateDisclaimerOptions(
  args: options.Args,
  flags: options.Flags
): LicensesGenerateDisclaimerOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd')
  };
}

export async function licensesGenerateDisclaimer(
  opts: LicensesGenerateDisclaimerOptions
) {
  let cwd = opts.cwd || process.cwd();
  await yarn.licenses(cwd, 'generate-disclaimer');
}
