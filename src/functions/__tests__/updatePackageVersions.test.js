// @flow
import path from 'path';
import updatePackageVersions from '../updatePackageVersions';
import * as fs from '../../utils/fs';
import { getFixturePath } from 'jest-fixtures';

jest.mock('../../utils/logger');

describe('function/updatePackageVersions', () => {
  let fsWriteSpy;

  beforeEach(() => {
    fsWriteSpy = jest
      .spyOn(fs, 'writeFile')
      .mockImplementation(() => Promise.resolve());
  });

  afterEach(() => {
    fsWriteSpy.mockClear();
  });

  describe('A simple project', async () => {
    it('should update dependencies for all packages', async () => {
      const cwd = await getFixturePath(__dirname, 'nested-workspaces');
      await updatePackageVersions({ react: '15.6.0' }, { cwd });

      const fsSpyCalls = fsWriteSpy.mock.calls;
      expect(fsWriteSpy).toHaveBeenCalledTimes(3);
      expect(fsWriteSpy.mock.calls[0][1]).toContain(`"react": "^15.6.0"`);
      expect(fsWriteSpy.mock.calls[1][1]).toContain(`"react": "^15.6.0"`);
      expect(fsWriteSpy.mock.calls[2][1]).toContain(`"react": "^15.6.0"`);
    });

    it('should return list of updated packages', async () => {
      const cwd = await getFixturePath(__dirname, 'nested-workspaces');
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
  });
});
