// @flow
import { login, toLoginOptions } from '../login';
import * as npm from '../../utils/npm';

jest.mock('../../utils/npm');

describe('bolt login', () => {
  test('should return the expected cwd', () => {
    let commandArgs = [];
    let expectedCwd = 'dummy/path/to/dir';
    let flags = { cwd: expectedCwd };
    let result = toLoginOptions(commandArgs, flags);
    expect(result.cwd).toBe(expectedCwd);
  });

  test('should call npm login once', async () => {
    let cwd = 'dummy/path/to/dir';
    let opt = { cwd };
    await login(opt);
    expect(npm.login).toHaveBeenCalledTimes(1);
  });
});
