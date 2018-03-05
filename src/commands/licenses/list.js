// @flow
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';
import * as yarn from '../../utils/yarn';
import type { SubCommandArgsType } from '../../types';

type LicensesListOptions = {
  cwd?: string
};

function toLicensesListOptions(
  args: options.Args,
  flags: options.Flags
): LicensesListOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd')
  };
}

export async function licensesList({
  flags,
  subCommandArgs
}: SubCommandArgsType) {
  let opts = toLicensesListOptions(subCommandArgs, flags);
  let cwd = opts.cwd || process.cwd();

  try {
    await yarn.cliCommand(cwd, 'licenses', ['list']);
  } catch (err) {
    throw new BoltError(err);
  }
}
