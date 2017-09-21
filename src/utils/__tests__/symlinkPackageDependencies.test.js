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

describe('utils/symlinkPackageDependencies', () => {
  describe('symlinkPackageDependencies() in valid project', () => {
    let project;
    let workspaces;
    let mkdir;
    let pkgToSymlink;

    beforeEach(async () => {
      const tempDir = await copyFixtureIntoTempDir(
        __dirname,
        'nested-workspaces-with-dependencies-installed'
      );
      project = await Project.init(tempDir);
      workspaces = await project.getWorkspaces();
      const wsToSymlink = project.getWorkspaceByName(workspaces, 'foo') || {};
      const pkgToSymlink = wsToSymlink.pkg;
    });

    it('should create node modules and node_modules/.bin if not existing', async () => {
      expect(await dirExists(pkgToSymlink.nodeModules)).toEqual(false);
      expect(await dirExists(pkgToSymlink.nodeModulesBin)).toEqual(false);

      await symlinkPackageDependencies(project, pkgToSymlink, ['semver']);

      expect(await dirExists(pkgToSymlink.nodeModules)).toEqual(true);
      expect(await dirExists(pkgToSymlink.nodeModulesBin)).toEqual(true);
    });

    it('should symlink external dependencies (only ones passed in)', async () => {
      const wsToSymlink = project.getWorkspaceByName(workspaces, 'foo') || {};
      const pkgToSymlink = wsToSymlink.pkg;
      const { nodeModules } = pkgToSymlink;

      expect(await dirExists(path.join(nodeModules, 'semver'))).toEqual(false);

      await symlinkPackageDependencies(project, pkgToSymlink, ['semver']);

      expect(await dirExists(path.join(nodeModules, 'semver'))).toEqual(true);
    });

    it('should symlink external dependencies bin files', async () => {
      const wsToSymlink = project.getWorkspaceByName(workspaces, 'foo') || {};
      const pkgToSymlink = wsToSymlink.pkg;
      const { nodeModulesBin } = pkgToSymlink;

      expect(await symlinkExists(nodeModulesBin, 'semver')).toEqual(false);

      await symlinkPackageDependencies(project, pkgToSymlink, ['semver']);

      expect(await symlinkExists(nodeModulesBin, 'semver')).toEqual(true);
    });

    it('should symlink internal dependencies', async () => {
      const wsToSymlink = project.getWorkspaceByName(workspaces, 'foo') || {};
      const pkgToSymlink = wsToSymlink.pkg;
      const { nodeModules, nodeModulesBin } = pkgToSymlink;

      expect(await dirExists(path.join(nodeModules, 'bar'))).toEqual(false);

      await symlinkPackageDependencies(project, pkgToSymlink, ['bar']);

      expect(await dirExists(path.join(nodeModules, 'bar'))).toEqual(true);
      expect(await symlinkExists(nodeModules, 'bar')).toEqual(true);
    });

    it('should run preinstall, postinstall and prepublish scripts', async () => {
      const wsToSymlink = project.getWorkspaceByName(workspaces, 'foo') || {};
      const pkgToSymlink = wsToSymlink.pkg;

      await symlinkPackageDependencies(project, pkgToSymlink, ['bar']);

      expect(yarn.run).toHaveBeenCalledTimes(3);
      const yarnCalls = unsafeYarn.run.mock.calls;
      expect(yarnCalls[0][1]).toEqual('preinstall');
      expect(yarnCalls[1][1]).toEqual('postinstall');
      expect(yarnCalls[2][1]).toEqual('prepublish');
    });
  });
});
