// @flow
import * as options from '../utils/options';
import {PError} from '../utils/errors';

import {toLicensesGenerateDisclaimerOptions, licensesGenerateDisclaimer} from './licenses/generateDisclaimer';
import {toLicensesListOptions, licensesList} from './licenses/list';

export type LicensesOptions = {
  command: string,
  commandArgs: options.Args,
  commandFlags: options.Flags
};

export function toLicensesOptions(args: options.Args, flags: options.Flags): LicensesOptions {
  let [command, ...commandArgs] = args;
  return {
    command,
    commandArgs,
    commandFlags: flags,
  };
}

export async function licenses(opts: LicensesOptions) {
  if (opts.command === 'generate-disclaimer') {
    await licensesGenerateDisclaimer(toLicensesGenerateDisclaimerOptions(opts.commandArgs, opts.commandFlags));
  } else if (opts.command === 'list' || opts.command === 'ls' || typeof opts.command === 'undefined') {
    await licensesList(toLicensesListOptions(opts.commandArgs, opts.commandFlags));
  } else {
    throw new PError(`You must specify a valid command to run in "pyarn licenses"`);
  }
}
