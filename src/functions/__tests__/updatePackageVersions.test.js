// @flow
import path from 'path';
import updatePackageVersions from '../updatePackageVersions';
import * as fs from '../../utils/fs';
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
  let cwd, fooPath, barPath, bazPath;

  describe('A simple project', async () => {
    beforeEach(async () => {
      cwd = await copyFixtureIntoTempDir(__dirname, 'nested-workspaces');
      fooPath = path.join(cwd, 'packages', 'foo');
      barPath = path.join(cwd, 'packages', 'bar');
      bazPath = path.join(cwd, 'packages', 'foo', 'packages', 'baz');
    });

    it('should update dependencies for all packages', async () => {
      expect(await getDepVersion(fooPath, 'react')).toBe('^15.6.1');
      expect(await getDepVersion(barPath, 'react')).toBe('^15.6.1');
      expect(await getDepVersion(bazPath, 'react')).toBe('^15.6.1');

      await updatePackageVersions({ react: '15.6.0' }, { cwd });

      expect(await getDepVersion(fooPath, 'react')).toBe('^15.6.0');
      expect(await getDepVersion(barPath, 'react')).toBe('^15.6.0');
      expect(await getDepVersion(bazPath, 'react')).toBe('^15.6.0');
    });

    it('should return list of updated packages', async () => {
      const updated = await updatePackageVersions({ react: '15.6.0' }, { cwd });
      const expectedUpdated = [
        'packages/foo/package.json',
        'packages/bar/package.json',
        'packages/foo/packages/baz/package.json'
      ];

      expect(updated.length).toEqual(expectedUpdated.length);
      expectedUpdated.forEach(expected => {
        const found = updated.find(p => path.relative(cwd, p) === expected);
        expect(found).toBeDefined();
      });
    });

    it('should be able to update more than one package at a time', async () => {
      expect(await getDepVersion(fooPath, 'react')).toBe('^15.6.1');
      expect(await getDepVersion(fooPath, 'bar')).toBe('^1.0.0');

      await updatePackageVersions({ react: '15.6.0', bar: '1.0.1' }, { cwd });

      expect(await getDepVersion(fooPath, 'react')).toBe('^15.6.0');
      expect(await getDepVersion(fooPath, 'bar')).toBe('^1.0.1');
    });
  });

  it('should update a peerDep and devDep together', async () => {
    cwd = await copyFixtureIntoTempDir(
      __dirname,
      'simple-project-with-multiple-depTypes'
    );
    fooPath = path.join(cwd, 'packages', 'foo');
    expect(await getDepVersion(fooPath, 'react', 'devDependencies')).toBe(
      '^16.0.0'
    );
    expect(await getDepVersion(fooPath, 'react', 'peerDependencies')).toBe(
      '^16.0.0'
    );

    await updatePackageVersions({ react: '15.6.0' }, { cwd });

    expect(await getDepVersion(fooPath, 'react', 'devDependencies')).toBe(
      '^15.6.0'
    );
    expect(await getDepVersion(fooPath, 'react', 'peerDependencies')).toBe(
      '^15.6.0'
    );
  });
});
