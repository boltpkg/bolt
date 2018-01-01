// @flow
import * as options from '../../utils/options';
import * as yarn from '../../utils/yarn';

export type LicensesListOptions = {
  cwd?: string
};

export function toLicensesListOptions(
  args: options.Args,
  flags: options.Flags
): LicensesListOptions {
  return {
    cwd: options.string(flags.cwd, 'cwd')
  };
}

export async function licensesList(opts: LicensesListOptions) {
  let cwd = opts.cwd || process.cwd();
  await yarn.licenses(cwd, 'list');
}
