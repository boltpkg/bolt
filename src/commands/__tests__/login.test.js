// @flow
import { login, toLoginOptions } from '../login';
import * as npm from '../../utils/npm';

jest.mock('../../utils/npm');

describe('bolt login', () => {
  test('should return the expected cwd', () => {
    const commandArgs = [];
    const expectedCwd = 'dummy/path/to/dir';
    const flags = { cwd: expectedCwd };
    const result = toLoginOptions(commandArgs, flags);
    expect(result.cwd).toBe(expectedCwd);
  });

  test('should call npm login once', async () => {
    const cwd = 'dummy/path/to/dir';
    const opt = { cwd };
    await login(opt);
    expect(npm.login).toHaveBeenCalledTimes(1);
  });
});
