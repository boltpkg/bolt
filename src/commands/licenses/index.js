// @flow
import * as options from '../../utils/options';
import { BoltError } from '../../utils/errors';

const commands = {
  'generate-disclaimer': require('./generateDisclaimer')
    .licensesGenerateDisclaimer,
  list: require('./list').licensesList
};

export async function licenses(
  flags: options.Flags,
  commandArgs: Array<string>,
  subCommand: string,
  subCommandArgs: Array<string>
) {
  if (commands[subCommand]) {
    return await commands[subCommand](flags, subCommandArgs);
  }

  throw new BoltError(`Invalid subcommand. Try "generate-disclaimer or list"`);
}
