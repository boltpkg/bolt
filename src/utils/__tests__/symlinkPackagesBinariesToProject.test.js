// @flow
import path from 'path';
import symlinkPackagesBinariesToProject from '../symlinkPackagesBinariesToProject';
import * as fs from '../fs';
import * as yarn from '../yarn';
import Project from '../../Project';
import fixtures from 'fixturez';

const f = fixtures(__dirname);

jest.mock('../yarn');

async function initProject(fixture) {
  return await Project.init(f.copy(fixture));
}

async function getPackage(project, pkgName) {
  let packages = await project.getPackages();
  let pkg = project.getPackageByName(packages, pkgName);
  if (!pkg) throw new Error(`Missing package ${pkgName}`);
  return pkg;
}

async function getProjectSymlink(project, symlinkName) {
  let nodeModulesBin = project.pkg.nodeModulesBin;
  let symlinkPath = path.join(nodeModulesBin, symlinkName);
  let exists = await fs.symlinkExists(symlinkPath);
  if (!exists) return undefined;
  return fs.readlink(symlinkPath);
}

const FIXTURE_NAME = 'nested-workspaces-with-muliple-binaries';

describe('utils/symlinkPackagesBinariesToProject()', () => {
  test('symlinks simple binary file to project', async () => {
    let project = await initProject(FIXTURE_NAME);
    let nodeModulesBin = project.pkg.nodeModulesBin;
    expect(await getProjectSymlink(project, 'zee')).toBe(undefined);
    await symlinkPackagesBinariesToProject(project);
    expect(await getProjectSymlink(project, 'zee')).toBe(
      '../../packages/zee/zee.js'
    );
  });
  test('symlinks scoped binary file to project', async () => {
    let project = await initProject(FIXTURE_NAME);
    let nodeModulesBin = project.pkg.nodeModulesBin;
    expect(await getProjectSymlink(project, 'baz')).toBe(undefined);
    await symlinkPackagesBinariesToProject(project);
    // We are checking that a scoped package name resolves to a simple binary name
    expect(await getProjectSymlink(project, 'baz')).toBe(
      '../../packages/foo/packages/baz/baz.js'
    );
  });

  test('symlinks binary files from bin object to project', async () => {
    let project = await initProject(FIXTURE_NAME);
    let nodeModulesBin = project.pkg.nodeModulesBin;
    expect(await getProjectSymlink(project, 'bar1')).toBe(undefined);
    await symlinkPackagesBinariesToProject(project);
    // bar exposes to binaries like so:
    // "bin": "bin": { "bar1": "bin/bar1.js", "bar2": "bin/anotherBar.js" }
    // We'll check that both get created and named correctly
    expect(await getProjectSymlink(project, 'bar1')).toBe(
      '../../packages/bar/bin/bar1.js'
    );
    expect(await getProjectSymlink(project, 'bar2')).toBe(
      '../../packages/bar/bin/anotherBar.js'
    );
  });
});
