// @flow
import meow from 'meow';
import chalk from 'chalk';
import * as logger from './utils/logger';
import * as messages from './utils/messages';
import * as processes from './utils/processes';
import { BoltError } from './utils/errors';
import cleanStack from 'clean-stack';
import * as commands from './commands';
import * as options from './utils/options';

async function runCommandFromCli(args: options.Args, flags: options.Flags) {
  let [command, ...commandArgs] = args;
  let [subCommand, ...subCommandArgs] = commandArgs;

  if (!command) return await commands['install'](flags, commandArgs);

  if (command && commands[command])
    return await commands[command](
      flags,
      commandArgs,
      subCommand,
      subCommandArgs
    );

  throw new BoltError(`You must specify a valid command`);
}

export default async function cli(argv: Array<string>, exit: boolean = false) {
  const start = Date.now();

  const { pkg, input, flags } = meow({
    argv,
    help: messages.helpContent(),
    flags: {
      '--': true
    }
  });

  logger.title(
    messages.boltVersion(pkg.version),
    messages.nodeVersion(process.versions.node),
    { emoji: '⚡️' }
  );

  processes.handleSignals();

  try {
    await runCommandFromCli(input, flags);
  } catch (err) {
    if (err instanceof BoltError) {
      logger.error(err.message);
    } else {
      logger.error(cleanStack(err.stack));
    }

    if (exit) {
      process.exit(1);
    } else {
      throw err;
    }
  }

  const timing = (Date.now() - start) / 1000;
  const rounded = Math.round(timing * 100) / 100;

  logger.info(messages.doneInSeconds(rounded), {
    emoji: '🏁',
    prefix: false
  });
}
