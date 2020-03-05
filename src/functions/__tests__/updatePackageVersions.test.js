// @flow
import path from 'path';
import updatePackageVersions from '../updatePackageVersions';
import * as fs from '../../utils/fs';
import * as logger from '../../utils/logger';
import Config from '../../Config';
import * as messages from '../../utils/messages';
import fixtures from 'fixturez';

const f = fixtures(__dirname);

jest.mock('../../utils/logger');

/*
 * NOTE: The way we are testing, we are testing the update of a single dependency.
 * This means that projects will be left in an invalid state after most test runs.
 */

async function getDepVersion(
  pathToPkg: string,
  depName: string,
  depType: string = 'dependencies'
) {
  let config = await Config.init(path.join(pathToPkg, 'package.json'));
  let deps = config.getDeps(depType);
  return deps ? deps[depName] : undefined;
}

describe('function/updatePackageVersions', () => {
  let cwd, pkgWithDepsPath, pkgPeerDepsPath, loggerSpy;

  describe('A simple project with lots of internally linked deps', () => {
    beforeEach(async () => {
      cwd = f.copy('lots-of-internally-linked-deps');
      pkgWithDepsPath = path.join(cwd, 'packages', 'has-all-deps');
      pkgPeerDepsPath = path.join(cwd, 'packages', 'has-all-deps-with-peers');
      loggerSpy = jest.spyOn(logger, 'warn');
    });

    it('should update internal deps with caret deps', async () => {
      let updatedPackages = { 'caret-dep': '1.2.0', 'has-all-deps': '1.1.2' };
      expect(await getDepVersion(pkgWithDepsPath, 'caret-dep')).toBe('^1.1.1');
      // pretend we've just updated 'caret-dep' to 2.0.0
      await updatePackageVersions(updatedPackages, { cwd });

      expect(await getDepVersion(pkgWithDepsPath, 'caret-dep')).toBe('^1.2.0');
    });

    it('should update internal deps with tilde deps', async () => {
      let updatePackages = { 'tilde-dep': '2.0.0', 'has-all-deps': '1.1.2' };
      expect(await getDepVersion(pkgWithDepsPath, 'tilde-dep')).toBe('~1.1.1');
      // pretend we've just updated 'tilde-dep' to 2.0.0
      await updatePackageVersions(updatePackages, { cwd });

      expect(await getDepVersion(pkgWithDepsPath, 'tilde-dep')).toBe('~2.0.0');
    });

    it('should update internal deps with pinned deps', async () => {
      let updatePackages = { 'pinned-dep': '2.0.0', 'has-all-deps': '1.1.2' };
      expect(await getDepVersion(pkgWithDepsPath, 'pinned-dep')).toBe('1.1.1');
      // pretend we've just updated 'pinned-dep' to 2.0.0
      await updatePackageVersions(updatePackages, { cwd });

      expect(await getDepVersion(pkgWithDepsPath, 'pinned-dep')).toBe('2.0.0');
    });

    it('should return list of updated packages', async () => {
      let updatePackages = {
        'caret-dep': '1.2.0',
        'has-all-deps': '1.1.2',
        'pinned-dep': '1.2.2'
      };

      let updated = await updatePackageVersions(updatePackages, { cwd });
      let expectedUpdated = [
        'packages/has-all-deps/package.json',
        'packages/pinned-dep/package.json'
      ];

      expect(updated.length).toEqual(expectedUpdated.length);
      expectedUpdated.forEach(expected => {
        let found = updated.find(p => path.relative(cwd, p) === expected);
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
        {
          'pinned-dep': '2.0.0',
          'tilde-dep': '2.0.0',
          'has-all-deps': '1.1.2'
        },
        { cwd }
      );

      expect(await getDepVersion(pkgWithDepsPath, 'pinned-dep')).toBe('2.0.0');
      expect(await getDepVersion(pkgWithDepsPath, 'tilde-dep')).toBe('~2.0.0');
    });

    it('should update a peerDep and devDep together', async () => {
      expect(
        await getDepVersion(pkgPeerDepsPath, 'caret-dep', 'devDependencies')
      ).toBe('^1.1.1');
      expect(
        await getDepVersion(pkgPeerDepsPath, 'caret-dep', 'peerDependencies')
      ).toBe('^1.1.1');

      await updatePackageVersions(
        { 'caret-dep': '1.2.0', 'has-all-deps-with-peers': '1.1.2' },
        { cwd }
      );

      expect(
        await getDepVersion(pkgPeerDepsPath, 'caret-dep', 'devDependencies')
      ).toBe('^1.2.0');
      expect(
        await getDepVersion(pkgPeerDepsPath, 'caret-dep', 'peerDependencies')
      ).toBe('^1.2.0');
    });
    it('should skip updating dependencies for packages not in the udpatedPackages', async () => {
      let updatePackages = { 'caret-dep': '1.2.0' };
      expect(
        await getDepVersion(pkgPeerDepsPath, 'caret-dep', 'peerDependencies')
      ).toBe('^1.1.1');
      await updatePackageVersions(updatePackages, { cwd });

      // This tests that peer deps not to be updated even though it has a dependency
      // as our passed updatePackages is not requesting its release.
      expect(
        await getDepVersion(pkgPeerDepsPath, 'caret-dep', 'peerDependencies')
      ).toBe('^1.1.1');
    });
    it('should throw when you will leave a version range without it being included', async () => {
      let updatePackages = { 'tilde-dep': '2.0.0' };
      let message = messages.invalidBoltWorkspacesFromUpdate(
        'has-all-deps',
        'tilde-dep',
        '~1.1.1',
        '2.0.0'
      );
      return updatePackageVersions(updatePackages, {
        cwd
      }).catch(returnedMessage => {
        expect(returnedMessage.message).toEqual(message);
      });
    });
  });
});
