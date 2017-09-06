// @flow
import * as options from './utils/options';
import * as logger from './utils/logger';
import {PError} from './utils/errors';

import {toAddOptions, add} from './commands/add';
import {toBuildOptions, build} from './commands/build';
import {toCheckOptions, check} from './commands/check';
import {toDocOptions, doc} from './commands/doc';
import {toFormatOptions, format} from './commands/format';
import {toGenerateOptions, generate} from './commands/generate';
import {toHelpOptions, help} from './commands/help';
import {toInitOptions, init} from './commands/init';
import {toInstallOptions, install} from './commands/install';
import {toLintOptions, lint} from './commands/lint';
import {toNormalizeOptions, normalize} from './commands/normalize';
import {toProjectOptions, project} from './commands/project';
import {toPublishOptions, publish} from './commands/publish';
import {toPublishLockOptions, publishLock} from './commands/publishLock';
import {toPublishUnlockOptions, publishUnlock} from './commands/publishUnlock';
import {toRunOptions, run} from './commands/run';
import {toTestOptions, test} from './commands/test';
import {toUpgradeOptions, upgrade} from './commands/upgrade';
import {toVersionOptions, version} from './commands/version';
import {toWorkspaceOptions, workspace} from './commands/workspace';
import {toWorkspacesOptions, workspaces} from './commands/workspaces';

export default async function pyarn(args: options.Args, flags: options.Flags) {
  let [command, ...commandArgs] = args;

  if (command === 'add') {
    await add(toAddOptions(commandArgs, flags));
  } else if (command === 'build') {
    await build(toBuildOptions(commandArgs, flags));
  } else if (command === 'check') {
    await check(toCheckOptions(commandArgs, flags));
  } else if (command === 'doc') {
    await doc(toDocOptions(commandArgs, flags));
  } else if (command === 'format' || command === 'fmt') {
    await format(toFormatOptions(commandArgs, flags));
  } else if (command === 'generate' || command === 'g') {
    await generate(toGenerateOptions(commandArgs, flags));
  } else if (command === 'help') {
    await help(toHelpOptions(commandArgs, flags));
  } else if (command === 'init') {
    await init(toInitOptions(commandArgs, flags));
  } else if (command === 'install' || typeof command === 'undefined') {
    await install(toInstallOptions(commandArgs, flags));
  } else if (command === 'lint') {
    await lint(toLintOptions(commandArgs, flags));
  } else if (command === 'normalize') {
    await normalize(toNormalizeOptions(commandArgs, flags));
  } else if (command === 'project' || command === 'p') {
    await project(toProjectOptions(commandArgs, flags));
  } else if (command === 'publish') {
    await publish(toPublishOptions(commandArgs, flags));
  } else if (command === 'publish-lock') {
    await publishLock(toPublishLockOptions(commandArgs, flags));
  } else if (command === 'publish-unlock') {
    await publishUnlock(toPublishUnlockOptions(commandArgs, flags));
  } else if (command === 'run') {
    await run(toRunOptions(commandArgs, flags));
  } else if (command === 'test') {
    await test(toTestOptions(commandArgs, flags));
  } else if (command === 'upgrade') {
    await upgrade(toUpgradeOptions(commandArgs, flags));
  } else if (command === 'version') {
    await version(toVersionOptions(commandArgs, flags));
  } else if (command === 'workspace' || command === 'w') {
    await workspace(toWorkspaceOptions(commandArgs, flags));
  } else if (command === 'workspaces' || command === 'ws') {
    await workspaces(toWorkspacesOptions(commandArgs, flags));
  } else {
    await run(toRunOptions(args, flags));
  }
}
