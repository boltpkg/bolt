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
import { globalOptions } from './GlobalOptions';

const commandMap = {
  ADD: { add: true },
  AUTOCLEAN: { autoclean: true },
  BIN: { bin: true },
  CACHE: { cache: true },
  CACHE_CLEAN: { clean: true },
  CACHE_DIR: { dir: true },
  CACHE_LIST: { list: true, ls: true },
  CHECK: { check: true },
  CONFIG: { config: true },
  CONFIG_CURRENT: { current: true },
  CONFIG_DELETE: { delete: true },
  CONFIG_GET: { get: true },
  CONFIG_LIST: { list: true, ls: true },
  CONFIG_SET: { set: true },
  CREATE: { create: true },
  DOC: { doc: true },
  EXEC: { exec: true },
  FORMAT: { format: true, fmt: true },
  GENERATE: { generate: true },
  GLOBAL: { global: true },
  GLOBAL_ADD: { add: true },
  GLOBAL_BIN: { bin: true },
  GLOBAL_LIST: { list: true, ls: true },
  GLOBAL_REMOVE: { remove: true, rm: true },
  GLOBAL_UPGRADE: { upgrade: true, up: true },
  HELP: { help: true, h: true, man: true },
  IMPORT: { import: true },
  INFO: { info: true },
  INIT: { init: true },
  INSTALL: { install: true },
  LICENSES: { licenses: true },
  LICENSES_GENERATE_DISCLAIMER: { 'generate-disclaimer': true },
  LICENSES_LIST: { list: true, ls: true },
  LINK: { link: true },
  LINT: { lint: true },
  LIST: { list: true, ls: true },
  LOGIN: { login: true },
  LOGOUT: { logout: true },
  NORMALIZE: { normalize: true },
  OUTDATED: { outdated: true },
  OWNER: { owner: true },
  OWNER_ADD: { add: true },
  OWNER_LIST: { list: true, ls: true },
  OWNER_REMOVE: { remove: true, rm: true },
  PACK: { pack: true },
  PROJECT: { project: true, p: true },
  PROJECT_ADD: { add: true },
  PROJECT_EXEC: { exec: true },
  PROJECT_REMOVE: { remove: true, rm: true },
  PROJECT_RUN: { run: true },
  PROJECT_UPGRADE: { upgrade: true, up: true },
  PUBLISH: { publish: true },
  PUBLISH_LOCK: { 'publish-lock': true },
  PUBLISH_UNLOCK: { 'publish-unlock': true },
  REMOVE: { remove: true, rm: true },
  RUN: { run: true },
  TAG: { tag: true },
  TAG_ADD: { add: true },
  TAG_LIST: { list: true, ls: true },
  TAG_REMOVE: { remove: true, rm: true },
  TEAM: { team: true },
  TEAM_ADD: { add: true },
  TEAM_CREATE: { create: true },
  TEAM_DESTROY: { destroy: true },
  TEAM_LIST: { list: true, ls: true },
  TEAM_REMOVE: { remove: true, rm: true },
  TEST: { test: true, t: true },
  UNLINK: { unlink: true },
  UPGRADE: { upgrade: true, up: true },
  UPGRADE_INTERACTIVE: { 'upgrade-interactive': true },
  VERSION: { version: true },
  VERSIONS: { versions: true },
  WHY: { why: true },
  WORKSPACE: { workspace: true, w: true },
  WORKSPACE_ADD: { add: true },
  WORKSPACE_EXEC: { exec: true },
  WORKSPACE_LINK: { link: true },
  WORKSPACE_REMOVE: { remove: true, rm: true },
  WORKSPACE_RUN: { run: true },
  WORKSPACE_UNLINK: { unlink: true },
  WORKSPACE_UPGRADE: { upgrade: true, up: true },
  WORKSPACES: { workspaces: true, ws: true },
  WORKSPACES_ADD: { add: true },
  WORKSPACES_EXEC: { exec: true },
  WORKSPACES_REMOVE: { remove: true, rm: true },
  WORKSPACES_RUN: { run: true },
  WORKSPACES_UPGRADE: { upgrade: true, up: true }
};

function runCommandFromCli(args: options.Args, flags: options.Flags) {
  let [command, ...commandArgs] = args;
  let [subCommand, ...subCommandArgs] = commandArgs;

  if (typeof command === 'undefined' && flags.help) {
    return commands.help(commands.toHelpOptions(args, flags));
  }

  if (commandMap.ADD[command]) {
    return commands.add(commands.toAddOptions(commandArgs, flags));
  } else if (commandMap.AUTOCLEAN[command]) {
    return commands.autoclean(commands.toAutocleanOptions(commandArgs, flags));
  } else if (commandMap.BIN[command]) {
    return commands.bin(commands.toBinOptions(commandArgs, flags));
  } else if (commandMap.CACHE[command]) {
    if (commandMap.CACHE_CLEAN[subCommand]) {
      return commands.cacheClean(
        commands.toCacheCleanOptions(subCommandArgs, flags)
      );
    } else if (commandMap.CACHE_DIR[subCommand]) {
      return commands.cacheDir(
        commands.toCacheDirOptions(subCommandArgs, flags)
      );
    } else if (
      commandMap.CACHE_LIST[subCommand] ||
      typeof subCommand === 'undefined'
    ) {
      return commands.cacheList(
        commands.toCacheListOptions(subCommandArgs, flags)
      );
    }
  } else if (commandMap.CHECK[command]) {
    return commands.check(commands.toCheckOptions(commandArgs, flags));
  } else if (commandMap.CONFIG[command]) {
    if (commandMap.CONFIG_DELETE[subCommand]) {
      return commands.configDelete(
        commands.toConfigDeleteOptions(subCommandArgs, flags)
      );
    } else if (commandMap.CONFIG_GET[subCommand]) {
      return commands.configGet(
        commands.toConfigGetOptions(subCommandArgs, flags)
      );
    } else if (
      commandMap.CONFIG_LIST[subCommand] ||
      typeof subCommand === 'undefined'
    ) {
      return commands.configList(
        commands.toConfigListOptions(subCommandArgs, flags)
      );
    } else if (commandMap.CONFIG_SET[subCommand]) {
      return commands.configSet(
        commands.toConfigSetOptions(subCommandArgs, flags)
      );
    } else if (commandMap.CONFIG_CURRENT[subCommand]) {
      return commands.configCurrent(
        commands.toConfigCurrentOptions(subCommandArgs, flags)
      );
    }
  } else if (commandMap.CREATE[command]) {
    return commands.create(commands.toCreateOptions(commandArgs, flags));
  } else if (commandMap.DOC[command]) {
    return commands.doc(commands.toDocOptions(commandArgs, flags));
  } else if (commandMap.EXEC[command]) {
    return commands.exec(commands.toExecOptions(commandArgs, flags));
  } else if (commandMap.FORMAT[command]) {
    return commands.format(commands.toFormatOptions(commandArgs, flags));
  } else if (commandMap.GENERATE[command]) {
    return commands.generate(commands.toGenerateOptions(commandArgs, flags));
  } else if (commandMap.GLOBAL[command]) {
    if (commandMap.GLOBAL_ADD[subCommand]) {
      return commands.globalAdd(
        commands.toGlobalAddOptions(subCommandArgs, flags)
      );
    } else if (commandMap.GLOBAL_BIN[subCommand]) {
      return commands.globalBin(
        commands.toGlobalBinOptions(subCommandArgs, flags)
      );
    } else if (
      commandMap.GLOBAL_LIST[subCommand] ||
      typeof subCommand === 'undefined'
    ) {
      return commands.globalList(
        commands.toGlobalListOptions(subCommandArgs, flags)
      );
    } else if (commandMap.GLOBAL_REMOVE[subCommand]) {
      return commands.globalRemove(
        commands.toGlobalRemoveOptions(subCommandArgs, flags)
      );
    } else if (commandMap.GLOBAL_UPGRADE[subCommand]) {
      return commands.globalUpgrade(
        commands.toGlobalUpgradeOptions(subCommandArgs, flags)
      );
    }
  } else if (commandMap.HELP[command]) {
    return commands.help(commands.toHelpOptions(commandArgs, flags));
  } else if (commandMap.IMPORT[command]) {
    return commands.import_(commands.toImportOptions(commandArgs, flags));
  } else if (commandMap.INFO[command]) {
    return commands.info(commands.toInfoOptions(commandArgs, flags));
  } else if (commandMap.INIT[command]) {
    return commands.init(commands.toInitOptions(commandArgs, flags));
  } else if (commandMap.INSTALL[command] || typeof command === 'undefined') {
    return commands.install(commands.toInstallOptions(commandArgs, flags));
  } else if (commandMap.LICENSES[command]) {
    if (commandMap.LICENSES_GENERATE_DISCLAIMER[subCommand]) {
      return commands.licensesGenerateDisclaimer(
        commands.toLicensesGenerateDisclaimerOptions(subCommandArgs, flags)
      );
    } else if (
      commandMap.LICENSES_LIST[subCommand] ||
      typeof subCommand === 'undefined'
    ) {
      return commands.licensesList(
        commands.toLicensesListOptions(subCommandArgs, flags)
      );
    }
  } else if (commandMap.LINK[command]) {
    return commands.link(commands.toLinkOptions(commandArgs, flags));
  } else if (commandMap.LINT[command]) {
    return commands.lint(commands.toLintOptions(commandArgs, flags));
  } else if (commandMap.LIST[command]) {
    return commands.list(commands.toListOptions(commandArgs, flags));
  } else if (commandMap.LOGIN[command]) {
    return commands.login(commands.toLoginOptions(commandArgs, flags));
  } else if (commandMap.LOGOUT[command]) {
    return commands.logout(commands.toLogoutOptions(commandArgs, flags));
  } else if (commandMap.NORMALIZE[command]) {
    return commands.normalize(commands.toNormalizeOptions(commandArgs, flags));
  } else if (commandMap.OUTDATED[command]) {
    return commands.outdated(commands.toOutdatedOptions(commandArgs, flags));
  } else if (commandMap.OWNER[command]) {
    if (commandMap.OWNER_ADD[subCommand]) {
      return commands.ownerAdd(
        commands.toOwnerAddOptions(subCommandArgs, flags)
      );
    } else if (
      commandMap.OWNER_LIST[subCommand] ||
      typeof subCommand === 'undefined'
    ) {
      return commands.ownerList(
        commands.toOwnerListOptions(subCommandArgs, flags)
      );
    } else if (commandMap.OWNER_REMOVE[subCommand]) {
      return commands.ownerRemove(
        commands.toOwnerRemoveOptions(subCommandArgs, flags)
      );
    }
  } else if (commandMap.PACK[command]) {
    return commands.pack(commands.toPackOptions(commandArgs, flags));
  } else if (commandMap.PROJECT[command]) {
    if (commandMap.PROJECT_ADD[subCommand]) {
      return commands.projectAdd(
        commands.toProjectAddOptions(subCommandArgs, flags)
      );
    } else if (commandMap.PROJECT_EXEC[subCommand]) {
      return commands.projectExec(
        commands.toProjectExecOptions(subCommandArgs, flags)
      );
    } else if (commandMap.PROJECT_REMOVE[subCommand]) {
      return commands.projectRemove(
        commands.toProjectRemoveOptions(subCommandArgs, flags)
      );
    } else if (commandMap.PROJECT_RUN[subCommand]) {
      return commands.projectRun(
        commands.toProjectRunOptions(subCommandArgs, flags)
      );
    } else if (commandMap.PROJECT_UPGRADE[subCommand]) {
      return commands.projectUpgrade(
        commands.toProjectUpgradeOptions(subCommandArgs, flags)
      );
    } else {
      return commands.projectRun(
        commands.toProjectRunOptions(commandArgs, flags)
      );
    }
  } else if (commandMap.PUBLISH[command]) {
    return commands.publish(commands.toPublishOptions(commandArgs, flags));
  } else if (commandMap.PUBLISH_LOCK[command]) {
    return commands.publishLock(
      commands.toPublishLockOptions(commandArgs, flags)
    );
  } else if (commandMap.PUBLISH_UNLOCK[command]) {
    return commands.publishUnlock(
      commands.toPublishUnlockOptions(commandArgs, flags)
    );
  } else if (commandMap.REMOVE[command]) {
    return commands.remove(commands.toRemoveOptions(commandArgs, flags));
  } else if (commandMap.RUN[command]) {
    return commands.run(commands.toRunOptions(commandArgs, flags));
  } else if (commandMap.TAG[command]) {
    if (commandMap.TAG_ADD[subCommand]) {
      return commands.tagAdd(commands.toTagAddOptions(subCommandArgs, flags));
    } else if (
      commandMap.TAG_LIST[subCommand] ||
      typeof subCommand === 'undefined'
    ) {
      return commands.tagList(commands.toTagListOptions(subCommandArgs, flags));
    } else if (commandMap.TAG_REMOVE[subCommand]) {
      return commands.tagRemove(
        commands.toTagRemoveOptions(subCommandArgs, flags)
      );
    }
  } else if (commandMap.TEAM[command]) {
    if (commandMap.TEAM_ADD[subCommand]) {
      return commands.teamAdd(commands.toTeamAddOptions(subCommandArgs, flags));
    } else if (commandMap.TEAM_CREATE[subCommand]) {
      return commands.teamCreate(
        commands.toTeamCreateOptions(subCommandArgs, flags)
      );
    } else if (commandMap.TEAM_DESTROY[subCommand]) {
      return commands.teamDestroy(
        commands.toTeamDestroyOptions(subCommandArgs, flags)
      );
    } else if (
      commandMap.TEAM_LIST[subCommand] ||
      typeof subCommand === 'undefined'
    ) {
      return commands.teamList(
        commands.toTeamListOptions(subCommandArgs, flags)
      );
    } else if (commandMap.TEAM_REMOVE[subCommand]) {
      return commands.teamRemove(
        commands.toTeamRemoveOptions(subCommandArgs, flags)
      );
    }
  } else if (commandMap.TEST[command]) {
    return commands.test(commands.toTestOptions(commandArgs, flags));
  } else if (commandMap.UNLINK[command]) {
    return commands.unlink(commands.toUnlinkOptions(commandArgs, flags));
  } else if (commandMap.UPGRADE[command]) {
    return commands.upgrade(commands.toUpgradeOptions(commandArgs, flags));
  } else if (commandMap.UPGRADE_INTERACTIVE[command]) {
    return commands.upgradeInteractive(
      commands.toUpgradeInteractiveOptions(commandArgs, flags)
    );
  } else if (commandMap.VERSION[command]) {
    return commands.version(commands.toVersionOptions(commandArgs, flags));
  } else if (commandMap.VERSIONS[command]) {
    return commands.versions(commands.toVersionsOptions(commandArgs, flags));
  } else if (commandMap.WHY[command]) {
    return commands.why(commands.toWhyOptions(commandArgs, flags));
  } else if (commandMap.WORKSPACE[command]) {
    let [workspaceCommand, ...rest] = subCommandArgs;
    let workspaceArgs = [subCommand, ...rest];
    if (commandMap.WORKSPACE_ADD[workspaceCommand]) {
      return commands.workspaceAdd(
        commands.toWorkspaceAddOptions(workspaceArgs, flags)
      );
    } else if (commandMap.WORKSPACE_EXEC[workspaceCommand]) {
      return commands.workspaceExec(
        commands.toWorkspaceExecOptions(workspaceArgs, flags)
      );
    } else if (commandMap.WORKSPACE_LINK[workspaceCommand]) {
      return commands.workspacelink(
        commands.toWorkspacelinkOptions(workspaceArgs, flags)
      );
    } else if (commandMap.WORKSPACE_REMOVE[workspaceCommand]) {
      return commands.workspaceRemove(
        commands.toWorkspaceRemoveOptions(workspaceArgs, flags)
      );
    } else if (commandMap.WORKSPACE_RUN[workspaceCommand]) {
      return commands.workspaceRun(
        commands.toWorkspaceRunOptions(workspaceArgs, flags)
      );
    } else if (commandMap.WORKSPACE_UNLINK[workspaceCommand]) {
      return commands.workspaceUnlink(
        commands.toWorkspaceUnlinkOptions(workspaceArgs, flags)
      );
    } else if (commandMap.WORKSPACE_UPGRADE[workspaceCommand]) {
      return commands.workspaceUpgrade(
        commands.toWorkspaceUpgradeOptions(workspaceArgs, flags)
      );
    } else {
      return commands.workspaceRun(
        commands.toWorkspaceRunOptions([subCommand, ...subCommandArgs], flags)
      );
    }
  } else if (commandMap.WORKSPACES[command]) {
    if (commandMap.WORKSPACES_ADD[subCommand]) {
      return commands.workspacesAdd(
        commands.toWorkspacesAddOptions(subCommandArgs, flags)
      );
    } else if (commandMap.WORKSPACES_EXEC[subCommand]) {
      return commands.workspacesExec(
        commands.toWorkspacesExecOptions(subCommandArgs, flags)
      );
    } else if (commandMap.WORKSPACES_REMOVE[subCommand]) {
      return commands.workspacesRemove(
        commands.toWorkspacesRemoveOptions(subCommandArgs, flags)
      );
    } else if (commandMap.WORKSPACES_RUN[subCommand]) {
      return commands.workspacesRun(
        commands.toWorkspacesRunOptions(subCommandArgs, flags)
      );
    } else if (commandMap.WORKSPACES_UPGRADE[subCommand]) {
      return commands.workspacesUpgrade(
        commands.toWorkspacesUpgradeOptions(subCommandArgs, flags)
      );
    } else {
      return commands.workspacesRun(
        commands.toWorkspacesRunOptions(commandArgs, flags)
      );
    }
  } else {
    return commands.run(commands.toRunOptions(args, flags));
  }

  throw new BoltError(`You must specify a valid command`);
}

export default async function cli(argv: Array<string>, exit: boolean = false) {
  let start = Date.now();

  let { pkg, input, flags } = meow('', {
    argv,
    flags: {
      '--': true,
      /* Global options as defined in GlobalOptions.js.
       * Added here so bolt --<option> <cmd> doesn't parse <cmd> as the value of the <option> flag */
      prefix: {
        type: 'boolean'
      }
    },
    autoHelp: false,
    booleanDefault: undefined
  });

  logger.title(
    messages.boltVersion(pkg.version),
    messages.nodeVersion(process.versions.node),
    { emoji: '⚡️' }
  );

  processes.handleSignals();

  try {
    globalOptions.setFromFlags(flags);
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

  let timing = (Date.now() - start) / 1000;
  let rounded = Math.round(timing * 100) / 100;

  logger.info(messages.doneInSeconds(rounded), {
    emoji: '🏁',
    prefix: false
  });
}
