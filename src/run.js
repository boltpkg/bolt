// @flow
import * as options from './utils/options';
import * as logger from './utils/logger';
import {PError} from './utils/errors';

import {toAddOptions, add} from './commands/add';
import {toBinOptions, bin} from './commands/bin';
import {toBuildOptions, build} from './commands/build';
import {toCacheOptions, cache} from './commands/cache';
import {toCheckOptions, check} from './commands/check';
import {toConfigOptions, config} from './commands/config';
import {toCreateOptions, create} from './commands/create';
import {toDocOptions, doc} from './commands/doc';
import {toFormatOptions, format} from './commands/format';
import {toGenerateOptions, generate} from './commands/generate';
import {toGlobalOptions, global_} from './commands/global';
import {toHelpOptions, help} from './commands/help';
import {toImportOptions, import_} from './commands/import';
import {toInitOptions, init} from './commands/init';
import {toInfoOptions, info} from './commands/info';
import {toInstallOptions, install} from './commands/install';
import {toLintOptions, lint} from './commands/lint';
import {toLicensesOptions, licenses} from './commands/licenses';
import {toLinkOptions, link} from './commands/link';
import {toListOptions, list} from './commands/list';
import {toLoginOptions, login} from './commands/login';
import {toLogoutOptions, logout} from './commands/logout';
import {toNormalizeOptions, normalize} from './commands/normalize';
import {toOutdatedOptions, outdated} from './commands/outdated';
import {toOwnerOptions, owner} from './commands/owner';
import {toPackOptions, pack} from './commands/pack';
import {toProjectOptions, project} from './commands/project';
import {toPublishOptions, publish} from './commands/publish';
import {toPublishLockOptions, publishLock} from './commands/publishLock';
import {toPublishUnlockOptions, publishUnlock} from './commands/publishUnlock';
import {toRemoveOptions, remove} from './commands/remove';
import {toRunOptions, run} from './commands/run';
import {toTagOptions, tag} from './commands/tag';
import {toTeamOptions, team} from './commands/team';
import {toTestOptions, test} from './commands/test';
import {toUnlinkOptions, unlink} from './commands/unlink';
import {toUpgradeOptions, upgrade} from './commands/upgrade';
import {toUpgradeInteractiveOptions, upgradeInteractive} from './commands/upgradeInteractive';
import {toVersionOptions, version} from './commands/version';
import {toVersionsOptions, versions} from './commands/versions';
import {toWhyOptions, why} from './commands/why';
import {toWorkspaceOptions, workspace} from './commands/workspace';
import {toWorkspacesOptions, workspaces} from './commands/workspaces';

export default async function pyarn(args: options.Args, flags: options.Flags) {
  let [command, ...commandArgs] = args;

  if (command === 'add') {
    await add(toAddOptions(commandArgs, flags));
  } else if (command === 'bin') {
    await bin(toBinOptions(commandArgs, flags));
  } else if (command === 'build') {
    await build(toBuildOptions(commandArgs, flags));
  } else if (command === 'cache') {
    await cache(toCacheOptions(commandArgs, flags));
  } else if (command === 'check') {
    await check(toCheckOptions(commandArgs, flags));
  } else if (command === 'config') {
    await config(toConfigOptions(commandArgs, flags));
  } else if (command === 'create') {
    await create(toCreateOptions(commandArgs, flags));
  } else if (command === 'doc') {
    await doc(toDocOptions(commandArgs, flags));
  } else if (command === 'format' || command === 'fmt') {
    await format(toFormatOptions(commandArgs, flags));
  } else if (command === 'generate' || command === 'g') {
    await generate(toGenerateOptions(commandArgs, flags));
  } else if (command === 'global') {
    await global_(toGlobalOptions(commandArgs, flags));
  } else if (command === 'help' || command === 'h') {
    await help(toHelpOptions(commandArgs, flags));
  } else if (command === 'import') {
    await import_(toImportOptions(commandArgs, flags));
  } else if (command === 'info') {
    await info(toInfoOptions(commandArgs, flags));
  } else if (command === 'init') {
    await init(toInitOptions(commandArgs, flags));
  } else if (command === 'install' || typeof command === 'undefined') {
    await install(toInstallOptions(commandArgs, flags));
  } else if (command === 'licenses') {
    await licenses(toLicensesOptions(commandArgs, flags));
  } else if (command === 'link') {
    await link(toLinkOptions(commandArgs, flags));
  } else if (command === 'lint') {
    await lint(toLintOptions(commandArgs, flags));
  } else if (command === 'list' || command === 'ls') {
    await list(toListOptions(commandArgs, flags));
  } else if (command === 'login') {
    await login(toLoginOptions(commandArgs, flags));
  } else if (command === 'logout') {
    await logout(toLogoutOptions(commandArgs, flags));
  } else if (command === 'normalize') {
    await normalize(toNormalizeOptions(commandArgs, flags));
  } else if (command === 'outdated') {
    await outdated(toOutdatedOptions(commandArgs, flags));
  } else if (command === 'owner') {
    await owner(toOwnerOptions(commandArgs, flags));
  } else if (command === 'pack') {
    await pack(toPackOptions(commandArgs, flags));
  } else if (command === 'project' || command === 'p') {
    await project(toProjectOptions(commandArgs, flags));
  } else if (command === 'publish') {
    await publish(toPublishOptions(commandArgs, flags));
  } else if (command === 'publish-lock') {
    await publishLock(toPublishLockOptions(commandArgs, flags));
  } else if (command === 'publish-unlock') {
    await publishUnlock(toPublishUnlockOptions(commandArgs, flags));
  } else if (command === 'remove' || command === 'rm') {
    await remove(toRemoveOptions(commandArgs, flags));
  } else if (command === 'run') {
    await run(toRunOptions(commandArgs, flags));
  } else if (command === 'tag') {
    await tag(toTagOptions(commandArgs, flags));
  } else if (command === 'team') {
    await team(toTeamOptions(commandArgs, flags));
  } else if (command === 'test' || command === 't') {
    await test(toTestOptions(commandArgs, flags));
  } else if (command === 'unlink') {
    await unlink(toUnlinkOptions(commandArgs, flags));
  } else if (command === 'upgrade') {
    await upgrade(toUpgradeOptions(commandArgs, flags));
  } else if (command === 'upgrade-interactive') {
    await upgradeInteractive(toUpgradeInteractiveOptions(commandArgs, flags));
  } else if (command === 'version') {
    await version(toVersionOptions(commandArgs, flags));
  } else if (command === 'versions') {
    await versions(toVersionsOptions(commandArgs, flags));
  } else if (command === 'why') {
    await why(toWhyOptions(commandArgs, flags));
  } else if (command === 'workspace' || command === 'w') {
    await workspace(toWorkspaceOptions(commandArgs, flags));
  } else if (command === 'workspaces' || command === 'ws') {
    await workspaces(toWorkspacesOptions(commandArgs, flags));
  } else {
    await run(toRunOptions(args, flags));
  }
}
