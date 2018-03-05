// @flow
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';
import * as yarn from '../../utils/yarn';
import type { SubCommandArgsType } from '../../types';

type LicensesGenerateDisclaimerOptions = {
  cwd?: string
};

function toLicensesGenerateDisclaimerOptions(
  args: options.Args,
  flags: options.Flags
): LicensesGenerateDisclaimerOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd')
  };
}

export async function licensesGenerateDisclaimer({
  flags,
  subCommandArgs
}: SubCommandArgsType) {
  let opts = toLicensesGenerateDisclaimerOptions(subCommandArgs, flags);
  let cwd = opts.cwd || process.cwd();
  try {
    await yarn.cliCommand(cwd, 'licenses', ['generate-disclaimer']);
  } catch (err) {
    throw new BoltError(err);
  }
}
