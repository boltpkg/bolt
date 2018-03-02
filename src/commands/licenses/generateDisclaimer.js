// @flow
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';
import * as yarn from '../../utils/yarn';

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

export async function generateDisclaimer(
  args: options.Args,
  flags: options.Flags
) {
  let opts = toLicensesGenerateDisclaimerOptions(args, flags);
  let cwd = opts.cwd || process.cwd();
  try {
    await yarn.cliCommand(cwd, 'licenses', ['generate-disclaimer']);
  } catch (err) {
    throw new BoltError(err);
  }
}
