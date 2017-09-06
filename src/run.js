// @flow
import * as options from './utils/options';
import * as logger from './utils/logger';
import {PError} from './utils/errors';

import {toHelpOptions, help} from './commands/help';
import {toInitOptions, init} from './commands/init';
import {toInstallOptions, install} from './commands/install';
import {toNormalizeOptions, normalize} from './commands/normalize';
import {toPublishOptions, publish} from './commands/publish';
import {toPublishLockOptions, publishLock} from './commands/publishLock';
import {toPublishUnlockOptions, publishUnlock} from './commands/publishUnlock';
import {toRunOptions, run} from './commands/run';
import {toWorkspaceOptions, workspace} from './commands/workspace';
import {toWorkspacesOptions, workspaces} from './commands/workspaces';

export default async function pyarn(args: options.Args, flags: options.Flags) {
  let [command, ...commandArgs] = args;

  if (command === 'help') {
    await help(toHelpOptions(commandArgs, flags));
  } else if (command === 'init') {
    await init(toInitOptions(commandArgs, flags));
  } else if (command === 'install' || command === undefined) {
    await install(toInstallOptions(commandArgs, flags));
  } else if (command === 'normalize') {
    await normalize(toNormalizeOptions(commandArgs, flags));
  } else if (command === 'publish') {
    await publish(toPublishOptions(commandArgs, flags));
  } else if (command === 'publish-lock') {
    await publishLock(toPublishLockOptions(commandArgs, flags));
  } else if (command === 'publish-unlock') {
    await publishUnlock(toPublishUnlockOptions(commandArgs, flags));
  } else if (command === 'run') {
    await run(toRunOptions(commandArgs, flags));
  } else if (command === 'workspace' || command === 'w') {
    await workspace(toWorkspaceOptions(commandArgs, flags));
  } else if (command === 'workspaces' || command === 'ws') {
    await workspaces(toWorkspacesOptions(commandArgs, flags));
  } else {
    await run(toRunOptions([command, ...args], flags));
  }
}
