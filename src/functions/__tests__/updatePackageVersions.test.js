// @flow
import path from 'path';
import updatePackageVersions from '../updatePackageVersions';
import * as fs from '../../utils/fs';
import * as logger from '../../utils/logger';
import Config from '../../Config';
import { copyFixtureIntoTempDir } from 'jest-fixtures';

jest.mock('../../utils/logger');

async function getDepVersion(
  pathToPkg: string,
  depName: string,
  depType: string = 'dependencies'
) {
  const config = await Config.init(path.join(pathToPkg, 'package.json'));
  const deps = config.getDeps(depType);
  return deps ? deps[depName] : undefined;
}

describe('function/updatePackageVersions', () => {
  let cwd, pkgWithDepsPath, pkgPeerDepsPath, loggerSpy;

  describe('A simple project with lots of internally linked deps', async () => {
    beforeEach(async () => {
      cwd = await copyFixtureIntoTempDir(
        __dirname,
        'lots-of-internally-linked-deps'
      );
      pkgWithDepsPath = path.join(cwd, 'packages', 'has-all-deps');
      pkgPeerDepsPath = path.join(cwd, 'packages', 'has-all-deps-with-peers');
      loggerSpy = jest.spyOn(logger, 'warn');
    });

    it('should update internal deps with caret deps', async () => {
      expect(await getDepVersion(pkgWithDepsPath, 'caret-dep')).toBe('^1.1.1');
      // pretend we've just updated 'caret-dep' to 2.0.0
      await updatePackageVersions({ 'caret-dep': '2.0.0' }, { cwd });

      expect(await getDepVersion(pkgWithDepsPath, 'caret-dep')).toBe('^2.0.0');
    });

    it('should update internal deps with tilde deps', async () => {
      expect(await getDepVersion(pkgWithDepsPath, 'tilde-dep')).toBe('~1.1.1');
      // pretend we've just updated 'tilde-dep' to 2.0.0
      await updatePackageVersions({ 'tilde-dep': '2.0.0' }, { cwd });

      expect(await getDepVersion(pkgWithDepsPath, 'tilde-dep')).toBe('~2.0.0');
    });

    it('should update internal deps with pinned deps', async () => {
      expect(await getDepVersion(pkgWithDepsPath, 'pinned-dep')).toBe('1.1.1');
      // pretend we've just updated 'pinned-dep' to 2.0.0
      await updatePackageVersions({ 'pinned-dep': '2.0.0' }, { cwd });

      expect(await getDepVersion(pkgWithDepsPath, 'pinned-dep')).toBe('2.0.0');
    });

    it('should return list of updated packages', async () => {
      const updated = await updatePackageVersions(
        { 'caret-dep': '2.0.0' },
        { cwd }
      );
      const expectedUpdated = [
        'packages/has-all-deps/package.json',
        'packages/pinned-dep/package.json',
        'packages/has-all-deps-with-peers/package.json'
      ];

      expect(updated.length).toEqual(expectedUpdated.length);
      expectedUpdated.forEach(expected => {
        const found = updated.find(p => path.relative(cwd, p) === expected);
        expect(found).toBeDefined();
      });
    });

    it('should ignore external deps (and warn)', async () => {
      expect(await getDepVersion(pkgWithDepsPath, 'react')).toBe('^15.6.1');
      // pretend we've just updated 'pinned-dep' to 2.0.0
      await updatePackageVersions({ react: '16.0.0' }, { cwd });

      expect(await getDepVersion(pkgWithDepsPath, 'react')).toBe('^15.6.1');
      expect(loggerSpy).toHaveBeenCalled();
    });

    it('should update more than one package at once', async () => {
      expect(await getDepVersion(pkgWithDepsPath, 'pinned-dep')).toBe('1.1.1');
      expect(await getDepVersion(pkgWithDepsPath, 'tilde-dep')).toBe('~1.1.1');

      await updatePackageVersions(
        { 'pinned-dep': '2.0.0', 'tilde-dep': '2.0.0' },
        { cwd }
      );

      expect(await getDepVersion(pkgWithDepsPath, 'pinned-dep')).toBe('2.0.0');
      expect(await getDepVersion(pkgWithDepsPath, 'tilde-dep')).toBe('~2.0.0');
    });

    it('should update a peerDep and devDep together', async () => {
      expect(
        await getDepVersion(pkgPeerDepsPath, 'pinned-dep', 'devDependencies')
      ).toBe('1.1.1');
      expect(
        await getDepVersion(pkgPeerDepsPath, 'pinned-dep', 'peerDependencies')
      ).toBe('1.1.1');

      await updatePackageVersions({ 'pinned-dep': '2.0.0' }, { cwd });

      expect(
        await getDepVersion(pkgPeerDepsPath, 'pinned-dep', 'devDependencies')
      ).toBe('2.0.0');
      expect(
        await getDepVersion(pkgPeerDepsPath, 'pinned-dep', 'peerDependencies')
      ).toBe('2.0.0');
    });
  });
});
