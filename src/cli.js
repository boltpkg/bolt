// @flow
import meow from 'meow';
import chalk from 'chalk';
import * as logger from './utils/logger';
import * as processes from './utils/processes';
import {PError} from './utils/errors';
import cleanStack from 'clean-stack';
import run from './run';

export default async function cli(argv: Array<string>, exit: boolean = false) {
  const start = Date.now();
  const {pkg, input, flags} = meow({
    argv,
    help: `
      usage
        $ pyarn [command] <...args> <...opts>

      commands
        init         init a pyarn project
        install      install a pyarn project
        add          add a dependency to a pyarn project
        upgrade      upgrade a dependency in a pyarn project
        remove       remove a dependency from a pyarn project
        exec         execute a command in a pyarn project
        run          run a script in a pyarn project
        publish      publish all the packages in a pyarn project
        workspaces   run a pyarn command inside all workspaces
        workspace    run a pyarn command inside a specific workspace
        help         get help with pyarn commands
    `,
  });

  logger.title(`pyarn v${pkg.version}`);

  processes.handleSignals();

  try {
    await run(input, flags);
  } catch (err) {
    if (err instanceof PError) {
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

  logger.log(`Done in ${rounded}s.`);
}
