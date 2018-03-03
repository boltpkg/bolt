// @flow
import { logout } from '../logout';
import * as npm from '../../utils/npm';

jest.mock('../../utils/npm');

describe('bolt logout', () => {
  test('should call npm logout once', async () => {
    const cwd = 'dummy/path/to/dir';
    const flags = { cwd };
    await logout(flags, []);
    expect(npm.logout).toHaveBeenCalledTimes(1);
  });
});
