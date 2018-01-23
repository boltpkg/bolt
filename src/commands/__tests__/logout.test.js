// @flow
import { logout, toLogoutOptions } from '../logout';
import * as npm from '../../utils/npm';

jest.mock('../../utils/npm');

describe('bolt logout', () => {
  test('should return the expected cwd', () => {
    const commandArgs = [];
    const expectedCwd = 'dummy/path/to/dir';
    const flags = { cwd: expectedCwd };
    const result = toLogoutOptions(commandArgs, flags);
    expect(result.cwd).toBe(expectedCwd);
  });

  test('should call npm logout once', async () => {
    const cwd = 'dummy/path/to/dir';
    const opt = { cwd };
    await logout(opt);
    expect(npm.logout).toHaveBeenCalledTimes(1);
  });
});
