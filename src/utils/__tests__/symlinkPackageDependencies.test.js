// @flow
import path from 'path';
import { copyFixtureIntoTempDir } from 'jest-fixtures';

import symlinkPackageDependencies from '../symlinkPackageDependencies';
import * as fs from '../fs';
import * as yarn from '../yarn';
import Project from '../../Project';

jest.mock('../yarn');

const unsafeFs: any & typeof fs = fs;
const unsafeYarn: any & typeof yarn = yarn;

async function dirExists(dir: string) {
  try {
    const stat = await fs.stat(dir);
    return stat.isDirectory();
  } catch (err) {
    return false;
  }
}

async function symlinkExists(dir: string, symlink: string) {
  try {
    const stat = await fs.lstat(path.join(dir, symlink));
    return stat.isSymbolicLink();
  } catch (err) {
    return false;
  }
}

describe('utils/symlinkPackageDependencies()', () => {
  let project;
  let workspaces;
  let pkgToSymlink;
  let nodeModules;
  let nodeModulesBin;

  beforeEach(async () => {
    const tempDir = await copyFixtureIntoTempDir(
      __dirname,
      'nested-workspaces-with-root-dependencies-installed'
    );
    project = await Project.init(tempDir);
    workspaces = await project.getWorkspaces();
  });

  /********************
   * Linking packages *
  ********************/

  describe('linking packages', () => {
    beforeEach(() => {
      // We use the foo package as it has internal and external dependencies
      const workspaceToSymlink =
        project.getWorkspaceByName(workspaces, 'foo') || {};
      pkgToSymlink = workspaceToSymlink.pkg;
      nodeModules = pkgToSymlink.nodeModules;
      nodeModulesBin = pkgToSymlink.nodeModulesBin;
    });

    it('should create node modules and node_modules/.bin if not existing', async () => {
      expect(await dirExists(pkgToSymlink.nodeModules)).toEqual(false);
      expect(await dirExists(pkgToSymlink.nodeModulesBin)).toEqual(false);

      await symlinkPackageDependencies(project, pkgToSymlink, ['bar']);

      expect(await dirExists(pkgToSymlink.nodeModules)).toEqual(true);
      expect(await dirExists(pkgToSymlink.nodeModulesBin)).toEqual(true);
    });

    it('should symlink external dependencies (only ones passed in)', async () => {
      expect(await dirExists(path.join(nodeModules, 'external-dep'))).toEqual(
        false
      );

      await symlinkPackageDependencies(project, pkgToSymlink, ['external-dep']);

      expect(await dirExists(path.join(nodeModules, 'external-dep'))).toEqual(
        true
      );
    });

    it('should symlink internal dependencies', async () => {
      expect(await dirExists(path.join(nodeModules, 'bar'))).toEqual(false);

      await symlinkPackageDependencies(project, pkgToSymlink, ['bar']);

      expect(await dirExists(path.join(nodeModules, 'bar'))).toEqual(true);
      expect(await symlinkExists(nodeModules, 'bar')).toEqual(true);
    });

    it('should run correct lifecycle scripts', async () => {
      await symlinkPackageDependencies(project, pkgToSymlink, ['bar']);

      expect(yarn.runIfExists).toHaveBeenCalledTimes(4);
      const yarnCalls = unsafeYarn.runIfExists.mock.calls;
      expect(yarnCalls[0][1]).toEqual('preinstall');
      expect(yarnCalls[1][1]).toEqual('postinstall');
      expect(yarnCalls[2][1]).toEqual('prepublish');
      expect(yarnCalls[3][1]).toEqual('prepare');
    });
  });

  describe('linking binaries', () => {
    beforeEach(() => {
      // We use the zee package as it has internal and external dependencies that have various
      // kinds of bin set ups
      const workspaceToSymlink =
        project.getWorkspaceByName(workspaces, 'zee') || {};
      pkgToSymlink = workspaceToSymlink.pkg;
      nodeModules = pkgToSymlink.nodeModules;
      nodeModulesBin = pkgToSymlink.nodeModulesBin;
    });

    it('should symlink external dependencies bin files (when declared using strings)', async () => {
      expect(
        await symlinkExists(nodeModulesBin, 'external-dep-with-bins')
      ).toEqual(false);

      await symlinkPackageDependencies(project, pkgToSymlink, [
        'external-dep-with-bin'
      ]);

      expect(
        await symlinkExists(nodeModulesBin, 'external-dep-with-bin')
      ).toEqual(true);
    });

    it('should symlink external dependencies bin files (when declared using object)', async () => {
      expect(
        await symlinkExists(nodeModulesBin, 'external-dep-two-bins-1')
      ).toEqual(false);

      await symlinkPackageDependencies(project, pkgToSymlink, [
        'external-dep-with-two-bins'
      ]);

      expect(
        await symlinkExists(nodeModulesBin, 'external-dep-two-bins-1')
      ).toEqual(true);
    });
  });

  it('should symlink internal dependencies bin files (when declared using string)', async () => {
    expect(await symlinkExists(nodeModulesBin, 'bar')).toEqual(false);

    await symlinkPackageDependencies(project, pkgToSymlink, ['bar']);

    expect(await symlinkExists(nodeModulesBin, 'bar')).toEqual(true);
  });

  it('should symlink internal dependencies bin files (when declared using object)', async () => {
    expect(await symlinkExists(nodeModulesBin, 'baz-1')).toEqual(false);
    expect(await symlinkExists(nodeModulesBin, 'baz-2')).toEqual(false);

    await symlinkPackageDependencies(project, pkgToSymlink, ['baz']);

    expect(await symlinkExists(nodeModulesBin, 'baz-1')).toEqual(true);
    expect(await symlinkExists(nodeModulesBin, 'baz-2')).toEqual(true);
  });
});
