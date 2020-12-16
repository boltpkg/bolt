// @flow
import path from 'path';
import symlinkPackageDependencies from '../symlinkPackageDependencies';
import * as fs from '../fs';
import * as yarn from '../yarn';
import Project from '../../Project';
import fixtures from 'fixturez';

const f = fixtures(__dirname);

jest.mock('../yarn');

const unsafeFs: any & typeof fs = fs;
const unsafeYarn: any & typeof yarn = yarn;

async function initProject(fixture) {
  return await Project.init(f.copy(fixture));
}

async function getPackage(project, pkgName) {
  let packages = await project.getPackages();
  let pkg = project.getPackageByName(packages, pkgName);
  if (!pkg) throw new Error(`Missing package ${pkgName}`);
  return pkg;
}

const FIXTURE_NAME = 'nested-workspaces-with-root-dependencies-installed';

describe('utils/symlinkPackageDependencies()', () => {
  test('creates node_modules and node_modules/.bin', async () => {
    let project = await initProject(FIXTURE_NAME);
    let packages = await project.getPackages();
    let { graph } = await project.getDependencyGraph(packages);
    let pkg = await getPackage(project, 'foo');
    expect(await fs.dirExists(pkg.nodeModules)).toBe(false);
    expect(await fs.dirExists(pkg.nodeModulesBin)).toBe(false);
    await symlinkPackageDependencies(project, pkg, ['bar'], graph);
    expect(await fs.dirExists(pkg.nodeModules)).toBe(true);
    expect(await fs.dirExists(pkg.nodeModulesBin)).toBe(true);
  });

  test('symlinks external dependencies', async () => {
    let project = await initProject(FIXTURE_NAME);
    let packages = await project.getPackages();
    let { graph } = await project.getDependencyGraph(packages);
    let pkg = await getPackage(project, 'foo');
    let depPath = path.join(pkg.nodeModules, 'external-dep');
    expect(await fs.dirExists(depPath)).toBe(false);
    await symlinkPackageDependencies(project, pkg, ['external-dep'], graph);
    expect(await fs.dirExists(depPath)).toBe(true);
  });

  test('symlinks internal dependencies', async () => {
    let project = await initProject(FIXTURE_NAME);
    let packages = await project.getPackages();
    let { graph } = await project.getDependencyGraph(packages);
    let pkg = await getPackage(project, 'foo');
    let depPath = path.join(pkg.nodeModules, 'bar');
    expect(await fs.dirExists(depPath)).toEqual(false);
    await symlinkPackageDependencies(project, pkg, ['bar'], graph);
    expect(await fs.dirExists(depPath)).toEqual(true);
    expect(await fs.symlinkExists(depPath)).toEqual(true);
  });

  test('runs correct lifecycle scripts', async () => {
    let project = await initProject(FIXTURE_NAME);
    let packages = await project.getPackages();
    let { graph } = await project.getDependencyGraph(packages);
    let pkg = await getPackage(project, 'foo');
    await symlinkPackageDependencies(project, pkg, ['bar'], graph);
    expect(yarn.runIfExists).toHaveBeenCalledTimes(4);
    expect(unsafeYarn.runIfExists.mock.calls[0][1]).toEqual('preinstall');
    expect(unsafeYarn.runIfExists.mock.calls[1][1]).toEqual('postinstall');
    expect(unsafeYarn.runIfExists.mock.calls[2][1]).toEqual('prepublish');
    expect(unsafeYarn.runIfExists.mock.calls[3][1]).toEqual('prepare');
  });

  test('symlinks external deps bins (string)', async () => {
    let project = await initProject(FIXTURE_NAME);
    let packages = await project.getPackages();
    let { graph } = await project.getDependencyGraph(packages);
    let pkg = await getPackage(project, 'zee');
    let symPath = path.join(pkg.nodeModulesBin, 'external-dep-with-bin');
    expect(await fs.symlinkExists(symPath)).toEqual(false);
    await symlinkPackageDependencies(project, pkg, ['external-dep-with-bin'], graph);
    expect(await fs.symlinkExists(symPath)).toEqual(true);
  });

  test('symlinks external deps bins (object)', async () => {
    let project = await initProject(FIXTURE_NAME);
    let packages = await project.getPackages();
    let { graph } = await project.getDependencyGraph(packages);
    let pkg = await getPackage(project, 'zee');
    let symPath = path.join(pkg.nodeModulesBin, 'external-dep-two-bins-1');
    expect(await fs.symlinkExists(symPath)).toEqual(false);
    await symlinkPackageDependencies(project, pkg, [
      'external-dep-with-two-bins'
    ], graph);
    expect(await fs.symlinkExists(symPath)).toEqual(true);
  });

  test('symlinks internal deps bins (string)', async () => {
    let project = await initProject(FIXTURE_NAME);
    let packages = await project.getPackages();
    let { graph } = await project.getDependencyGraph(packages);
    let pkg = await getPackage(project, 'zee');
    let symPath = path.join(pkg.nodeModulesBin, 'bar');
    expect(await fs.symlinkExists(symPath)).toEqual(false);
    await symlinkPackageDependencies(project, pkg, ['bar'], graph);
    expect(await fs.symlinkExists(symPath)).toEqual(true);
  });

  test('symlinks internal deps bins (when declared using object)', async () => {
    let project = await initProject(FIXTURE_NAME);
    let packages = await project.getPackages();
    let { graph } = await project.getDependencyGraph(packages);
    let pkg = await getPackage(project, 'zee');
    let baz1Path = path.join(pkg.nodeModulesBin, 'baz-1');
    let baz2Path = path.join(pkg.nodeModulesBin, 'baz-2');
    expect(await fs.symlinkExists(baz1Path)).toEqual(false);
    expect(await fs.symlinkExists(baz2Path)).toEqual(false);
    await symlinkPackageDependencies(project, pkg, ['baz'], graph);
    expect(await fs.symlinkExists(baz1Path)).toEqual(true);
    expect(await fs.symlinkExists(baz2Path)).toEqual(true);
  });
});
