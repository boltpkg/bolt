// @flow
import { info } from '../info';

import * as yarn from '../../utils/yarn';

jest.mock('../../utils/yarn');

const cwd = 'dummy/path/to/dir';
const args = ['react'];
const flags = { cwd, json: true };
const opt = { flags, args };

describe('bolt info', () => {
  test('should call npm login once', async () => {
    await info(flags, args);
    expect(yarn.info).toHaveBeenCalledTimes(1);
  });
});
