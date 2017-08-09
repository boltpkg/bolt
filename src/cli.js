// @flow
import meow from 'meow';
import chalk from 'chalk';
import * as logger from './utils/logger';
import * as processes from './utils/processes';
import cleanStack from 'clean-stack';
import pyarn from './';

const cli = meow(`
  Usage
    $ pyarn [command] <...args> <...opts>

  Commands
    init         Init a pyarn project
    install      Install a pyarn project
    add          Add a dependency to a pyarn project
    upgrade      Upgrade a dependency in a pyarn project
    remove       Remove a dependency from a pyarn project
    exec         Execute a command in a pyarn project
    run          Run a script in a pyarn project
    publish      Publish all the packages in a pyarn project
    workspaces   Run a pyarn command inside all workspaces
    workspace    Run a pyarn command inside a specific workspace
    help         Get help with pyarn commands
`);

async function main() {
  const [command, ...args] = cli.input;
  const opts = cli.flags;

  const start = Date.now();

  logger.title(`pyarn ${command} v${cli.pkg.version}`);

  processes.handleSignals();

  try {
    await pyarn(command, args, opts);
  } catch (err) {
    logger.error(cleanStack(err.stack));
    process.exit(1);
  }

  const timing = (Date.now() - start) / 1000;
  const rounded = Math.round(timing * 100) / 100;

  logger.log(`Done in ${rounded}s.`);
}

main();
