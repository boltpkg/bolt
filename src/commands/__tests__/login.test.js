// @flow
import { login } from '../login';
import * as npm from '../../utils/npm';

jest.mock('../../utils/npm');

describe('bolt login', () => {
  test('should call npm login once', async () => {
    const cwd = 'dummy/path/to/dir';
    const flags = { cwd };
    await login(flags, []);
    expect(npm.login).toHaveBeenCalledTimes(1);
  });
});
