// @flow
import { install } from '../install';
import * as processes from '../../utils/processes';
import * as yarn from '../../utils/yarn';
import * as path from 'path';
import * as fs from '../../utils/fs';
import Project from '../../Project';
import Workspace from '../../Workspace';
import fixtures from 'fixturez';
import * as constants from '../../constants';

const f = fixtures(__dirname);

jest.mock('../../utils/processes');
jest.mock('../../utils/yarn');
jest.mock('../../utils/logger');
jest.unmock('../install');

const unsafeProcesses: any & typeof processes = processes;
const unsafeYarn: any & typeof yarn = yarn;
const unsafeConstants: any & typeof constants = constants;
const unsafeProcess: any & typeof process = process;

async function assertNodeModulesExists(workspace: Workspace) {
  let nodeModulesStat = await fs.stat(workspace.pkg.nodeModules);
  let nodeModulesBinStat = await fs.stat(workspace.pkg.nodeModulesBin);
  expect(nodeModulesStat.isDirectory()).toEqual(true);
  expect(nodeModulesBinStat.isDirectory()).toEqual(true);
}

async function assertDependenciesSymlinked(workspace: Workspace) {
  let deps = workspace.pkg.getAllDependencies();

  for (let dep of deps.keys()) {
    let depStat = await fs.lstat(path.join(workspace.pkg.nodeModules, dep));
    expect(depStat.isSymbolicLink()).toBe(true);
  }
}

describe('install', () => {
  const yarnUserAgent = 'yarn/7.7.7 npm/? node/v8.9.4 darwin x64';
  const boltUserAgent = 'bolt/9.9.9 yarn/7.7.7 npm/? node/v8.9.4 darwin x64';

  beforeEach(() => {
    unsafeProcess.env = { parent_env: 1 };
    unsafeYarn.userAgent.mockReturnValueOnce(yarnUserAgent);
    unsafeConstants.BOLT_VERSION = '9.9.9';
  });

  test('simple-package, should run yarn install at the root', async () => {
    let cwd = f.find('simple-package');
    await install({ flags: { cwd }, commandArgs: [] });
    expect(unsafeProcesses.spawn).toHaveBeenCalledTimes(1);
    expect(unsafeProcesses.spawn).toHaveBeenCalledWith('yarn', ['install'], {
      cwd,
      env: { parent_env: 1, npm_config_user_agent: boltUserAgent },
      tty: true
    });
  });

  test('should still run yarn install at the root when called from ws', async () => {
    let rootDir = f.find('simple-project');
    let cwd = path.join(path.join(rootDir, 'packages', 'foo'));
    await install({ flags: { cwd }, commandArgs: [] });
    expect(unsafeProcesses.spawn).toHaveBeenCalledTimes(1);
    expect(unsafeProcesses.spawn).toHaveBeenCalledWith('yarn', ['install'], {
      cwd: rootDir,
      env: { parent_env: 1, npm_config_user_agent: boltUserAgent },
      tty: true
    });
  });

  test('should pass the --pure-lockfile flag correctly', async () => {
    let rootDir = f.find('simple-project');
    let cwd = path.join(path.join(rootDir, 'packages', 'foo'));
    await install({ flags: { cwd, pureLockfile: true }, commandArgs: [] });
    expect(unsafeProcesses.spawn).toHaveBeenCalledTimes(1);
    expect(unsafeProcesses.spawn).toHaveBeenCalledWith(
      'yarn',
      ['install', '--pure-lockfile'],
      {
        cwd: rootDir,
        env: { parent_env: 1, npm_config_user_agent: boltUserAgent },
        tty: true
      }
    );
  });

  test('should work in project with scoped packages', async () => {
    let cwd = f.find('nested-workspaces-with-scoped-package-names');
    let project = await Project.init(cwd);
    let workspaces = await project.getWorkspaces();

    await install({ flags: { cwd }, commandArgs: [] });

    for (let workspace of workspaces) {
      assertNodeModulesExists(workspace);
      assertDependenciesSymlinked(workspace);
    }
  });

  test('should append the bolt version to yarns npm_config_user_agent string', async () => {
    const spawnSpy = jest.spyOn(processes, 'spawn');
    let cwd = f.find('nested-workspaces-with-scoped-package-names');

    await install({ flags: { cwd }, commandArgs: [] });

    expect(spawnSpy.mock.calls[0][2].env.npm_config_user_agent).toEqual(
      'bolt/9.9.9 yarn/7.7.7 npm/? node/v8.9.4 darwin x64'
    );
  });

  test('should pass existing environment variables to yarn during install', async () => {
    const spawnSpy = jest.spyOn(processes, 'spawn');
    let cwd = f.find('nested-workspaces-with-scoped-package-names');

    await install({ flags: { cwd }, commandArgs: [] });

    expect(spawnSpy.mock.calls[0][2].env.parent_env).toEqual(1);
  });

  test('should run preinstall, postinstall and prepublish in each ws', async () => {
    let cwd = f.find('simple-project');
    let project = await Project.init(cwd);
    let workspaces = await project.getWorkspaces();

    await install({ flags: { cwd }, commandArgs: [] });

    for (let workspace of workspaces) {
      let runFn = unsafeYarn.runIfExists;
      expect(runFn).toHaveBeenCalledWith(workspace.pkg, 'preinstall');
      expect(runFn).toHaveBeenCalledWith(workspace.pkg, 'postinstall');
      expect(runFn).toHaveBeenCalledWith(workspace.pkg, 'prepublish');
    }
  });

  // This is re-testing symlinkPackageDependencies, but we'd rather be explicit here
  test('should install (symlink) all deps in workspaces', async () => {
    let cwd = f.copy('nested-workspaces-with-root-dependencies-installed');
    const project = await Project.init(cwd);
    const workspaces = await project.getWorkspaces();

    await install({ flags: { cwd }, commandArgs: [] });

    for (let workspace of workspaces) {
      assertNodeModulesExists(workspace);
      assertDependenciesSymlinked(workspace);
      // TODO: assertBinfileSymlinked (currently tested partially in symlinkPackageDependencies)
    }
  });

  test('should throw if project is not valid', async () => {
    let cwd = f.copy('invalid-project-root-dependency-on-ws');
    let project = await Project.init(cwd);

    await expect(
      install({ flags: { cwd }, commandArgs: [] })
    ).rejects.toBeInstanceOf(Error);
  });
});
