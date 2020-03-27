// @flow
import { install, toInstallOptions } from '../install';
import * as processes from '../../utils/processes';
import * as yarn from '../../utils/yarn';
import * as path from 'path';
import * as fs from '../../utils/fs';
import Project from '../../Project';
import Package from '../../Package';
import fixtures from 'fixturez';

const f = fixtures(__dirname);

jest.mock('../../utils/processes');
jest.mock('../../utils/yarn');
jest.mock('../../utils/logger');
jest.unmock('../install');

const unsafeProcesses: any & typeof processes = processes;
const unsafeYarn: any & typeof yarn = yarn;
const unsafeProcess: any & typeof process = process;

async function assertNodeModulesExists(pkg: Package) {
  let nodeModulesStat = await fs.stat(pkg.nodeModules);
  let nodeModulesBinStat = await fs.stat(pkg.nodeModulesBin);
  expect(nodeModulesStat.isDirectory()).toEqual(true);
  expect(nodeModulesBinStat.isDirectory()).toEqual(true);
}

async function assertDependenciesSymlinked(pkg: Package) {
  let deps = pkg.getAllDependencies();

  for (let dep of deps.keys()) {
    let depStat = await fs.lstat(path.join(pkg.nodeModules, dep));
    expect(depStat.isSymbolicLink()).toBe(true);
  }
}

describe('install', () => {
  test('simple-package, should run yarn install at the root', async () => {
    let cwd = f.find('simple-package');
    await install(
      toInstallOptions([], {
        cwd
      })
    );
    expect(yarn.install).toHaveBeenCalledTimes(1);
    expect(yarn.install).toHaveBeenCalledWith(cwd, 'default');
  });

  test('should still run yarn install at the root when called from ws', async () => {
    let rootDir = f.find('simple-project');
    let cwd = path.join(path.join(rootDir, 'packages', 'foo'));
    await install(
      toInstallOptions([], {
        cwd
      })
    );
    expect(yarn.install).toHaveBeenCalledTimes(1);
    expect(yarn.install).toHaveBeenCalledWith(rootDir, 'default');
  });

  test('should pass the --pure-lockfile flag correctly', async () => {
    let rootDir = f.find('simple-project');
    let cwd = path.join(path.join(rootDir, 'packages', 'foo'));
    await install(
      toInstallOptions([], {
        cwd,
        pureLockfile: true
      })
    );
    expect(yarn.install).toHaveBeenCalledTimes(1);
    expect(yarn.install).toHaveBeenCalledWith(rootDir, 'pure');
  });

  test('should pass the --frozen-lockfile flag correctly', async () => {
    const rootDir = f.find('simple-project');
    const cwd = path.join(path.join(rootDir, 'packages', 'foo'));
    await install(
      toInstallOptions([], {
        cwd,
        frozenLockfile: true
      })
    );
    expect(yarn.install).toHaveBeenCalledTimes(1);
    expect(yarn.install).toHaveBeenCalledWith(rootDir, 'frozen');
  });

  test('should correctly give priority to --frozen-lockfile if --pure-lockfile is also passed', async () => {
    const rootDir = f.find('simple-project');
    const cwd = path.join(path.join(rootDir, 'packages', 'foo'));
    await install(
      toInstallOptions([], {
        cwd,
        frozenLockfile: true,
        pureLockfile: true
      })
    );
    expect(yarn.install).toHaveBeenCalledTimes(1);
    expect(yarn.install).toHaveBeenCalledWith(rootDir, 'frozen');
  });

  test('should work in project with scoped packages', async () => {
    let cwd = f.find('nested-workspaces-with-scoped-package-names');
    let project = await Project.init(cwd);
    let packages = await project.getPackages();

    await install(
      toInstallOptions([], {
        cwd
      })
    );

    for (let pkg of packages) {
      assertNodeModulesExists(pkg);
      assertDependenciesSymlinked(pkg);
    }
  });

  test('should install even if a workspace is missing a package.json', async () => {
    let cwd = f.find('no-package-json-workspace');
    let project = await Project.init(cwd);
    let packages = await project.getPackages();

    await install(
      toInstallOptions([], {
        cwd
      })
    );
  });

  test('should run preinstall, postinstall and prepublish in each ws', async () => {
    let cwd = f.find('simple-project');
    let project = await Project.init(cwd);
    let packages = await project.getPackages();

    await install(
      toInstallOptions([], {
        cwd
      })
    );

    for (let pkg of packages) {
      let runFn = unsafeYarn.runIfExists;
      expect(runFn).toHaveBeenCalledWith(pkg, 'preinstall');
      expect(runFn).toHaveBeenCalledWith(pkg, 'postinstall');
      expect(runFn).toHaveBeenCalledWith(pkg, 'prepublish');
    }
  });

  // This is re-testing symlinkPackageDependencies, but we'd rather be explicit here
  test('should install (symlink) all deps in workspaces', async () => {
    let cwd = f.copy('nested-workspaces-with-root-dependencies-installed');
    let project = await Project.init(cwd);
    let packages = await project.getPackages();

    await install(
      toInstallOptions([], {
        cwd
      })
    );

    for (let pkg of packages) {
      assertNodeModulesExists(pkg);
      assertDependenciesSymlinked(pkg);
      // TODO: assertBinfileSymlinked (currently tested partially in symlinkPackageDependencies)
    }
  });

  test('should throw if project is not valid', async () => {
    let cwd = f.copy('invalid-project-root-dependency-on-ws');
    let project = await Project.init(cwd);

    await expect(
      install(
        toInstallOptions([], {
          cwd
        })
      )
    ).rejects.toBeInstanceOf(Error);
  });

  test('workspaces with bins', async () => {
    let cwd = f.copy('workspace-with-bin');
    let project = await Project.init(cwd);

    await install(toInstallOptions([], { cwd }));

    let binPath = path.join(
      cwd,
      'packages',
      'foo',
      'node_modules',
      '.bin',
      'bar'
    );
    let stat = await fs.stat(binPath);

    expect(stat.isFile()).toBe(true);
  });

  test('workspaces with bins installing twice still works', async () => {
    let cwd = f.copy('workspace-with-bin');
    let project = await Project.init(cwd);

    await install(toInstallOptions([], { cwd }));

    let binPath = path.join(
      cwd,
      'packages',
      'foo',
      'node_modules',
      '.bin',
      'bar'
    );
    let stat = await fs.stat(binPath);

    expect(stat.isFile()).toBe(true);
    
    // Test to make sure existing symlink problem doesn't break. It used to die if you ran bolt twice
    await install(toInstallOptions([], { cwd }));

    expect(stat.isFile()).toBe(true);
  });
});
