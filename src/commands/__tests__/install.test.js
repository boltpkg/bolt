// @flow
import { install, toInstallOptions } from '../install';
import * as processes from '../../utils/processes';
import * as yarn from '../../utils/yarn';
import * as path from 'path';
import * as fs from '../../utils/fs';
import Project from '../../Project';
import Workspace from '../../Workspace';
import { getFixturePath, copyFixtureIntoTempDir } from 'jest-fixtures';

jest.mock('../../utils/processes');
jest.mock('../../utils/yarn');
jest.mock('../../utils/logger');
jest.unmock('../install');

const unsafeProcesses: any & typeof processes = processes;
const unsafeYarn: any & typeof yarn = yarn;

async function assertNodeModulesExists(workspace: Workspace) {
  const nodeModulesStat = await fs.stat(workspace.pkg.nodeModules);
  const nodeModulesBinStat = await fs.stat(workspace.pkg.nodeModulesBin);
  expect(nodeModulesStat.isDirectory()).toEqual(true);
  expect(nodeModulesBinStat.isDirectory()).toEqual(true);
}

async function assertDependenciesSymlinked(workspace: Workspace) {
  const deps = workspace.pkg.getAllDependencies();

  for (let dep of deps.keys()) {
    const depStat = await fs.lstat(path.join(workspace.pkg.nodeModules, dep));
    expect(depStat.isSymbolicLink()).toBe(true);
  }
}

describe('install', () => {
  test('simple-package, should run yarn install at the root', async () => {
    let cwd = await getFixturePath(__dirname, 'simple-package');
    await install(toInstallOptions([], { cwd }));
    expect(unsafeProcesses.spawn).toHaveBeenCalledTimes(1);
    expect(unsafeProcesses.spawn).toHaveBeenCalledWith('yarn', ['install'], {
      cwd,
      tty: true
    });
  });

  test('should still run yarn install at the root when called from ws', async () => {
    let rootDir = await getFixturePath(__dirname, 'simple-project');
    let cwd = path.join(path.join(rootDir, 'packages', 'foo'));
    await install(toInstallOptions([], { cwd }));
    expect(unsafeProcesses.spawn).toHaveBeenCalledTimes(1);
    expect(unsafeProcesses.spawn).toHaveBeenCalledWith('yarn', ['install'], {
      cwd: rootDir,
      tty: true
    });
  });

  test('should pass the --pure-lockfile flag correctly', async () => {
    let rootDir = await getFixturePath(__dirname, 'simple-project');
    let cwd = path.join(path.join(rootDir, 'packages', 'foo'));
    await install(toInstallOptions([], { cwd, pureLockfile: true }));
    expect(unsafeProcesses.spawn).toHaveBeenCalledTimes(1);
    expect(unsafeProcesses.spawn).toHaveBeenCalledWith(
      'yarn',
      ['install', '--pure-lockfile'],
      {
        cwd: rootDir,
        tty: true
      }
    );
  });

  test('should work in project with scoped packages', async () => {
    let cwd = await getFixturePath(
      __dirname,
      'nested-workspaces-with-scoped-package-names'
    );
    const project = await Project.init(cwd);
    const workspaces = await project.getWorkspaces();

    await install(toInstallOptions([], { cwd }));

    for (let workspace of workspaces) {
      assertNodeModulesExists(workspace);
      assertDependenciesSymlinked(workspace);
    }
  });

  test('should run preinstall, postinstall and prepublish in each ws', async () => {
    let cwd = await getFixturePath(__dirname, 'simple-project');
    const project = await Project.init(cwd);
    const workspaces = await project.getWorkspaces();

    await install(toInstallOptions([], { cwd }));

    for (let workspace of workspaces) {
      const runFn = unsafeYarn.runIfExists;
      expect(runFn).toHaveBeenCalledWith(workspace.pkg, 'preinstall');
      expect(runFn).toHaveBeenCalledWith(workspace.pkg, 'postinstall');
      expect(runFn).toHaveBeenCalledWith(workspace.pkg, 'prepublish');
    }
  });

  // This is re-testing symlinkPackageDependencies, but we'd rather be explicit here
  test('should install (symlink) all deps in workspaces', async () => {
    const cwd = await copyFixtureIntoTempDir(
      __dirname,
      'nested-workspaces-with-root-dependencies-installed'
    );
    const project = await Project.init(cwd);
    const workspaces = await project.getWorkspaces();

    await install(toInstallOptions([], { cwd }));

    for (let workspace of workspaces) {
      assertNodeModulesExists(workspace);
      assertDependenciesSymlinked(workspace);
      // TODO: assertBinfileSymlinked (currently tested partially in symlinkPackageDependencies)
    }
  });

  test('should throw if project is not valid', async () => {
    const cwd = await copyFixtureIntoTempDir(
      __dirname,
      'invalid-project-root-dependency-on-ws'
    );
    const project = await Project.init(cwd);

    await expect(install(toInstallOptions([], { cwd }))).rejects.toBeInstanceOf(
      Error
    );
  });
});
