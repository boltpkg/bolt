// @flow
import { logout, toLogoutOptions } from '../logout';
import * as npm from '../../utils/npm';

jest.mock('../../utils/npm');

describe('bolt logout', () => {
  test('should return the expected cwd', () => {
    let commandArgs = [];
    let expectedCwd = 'dummy/path/to/dir';
    let flags = { cwd: expectedCwd };
    let result = toLogoutOptions(commandArgs, flags);
    expect(result.cwd).toBe(expectedCwd);
  });

  test('should call npm logout once', async () => {
    let cwd = 'dummy/path/to/dir';
    let opt = { cwd };
    await logout(opt);
    expect(npm.logout).toHaveBeenCalledTimes(1);
  });
});
