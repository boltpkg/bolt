// @flow
import { info } from '../info';

import * as yarn from '../../utils/yarn';

jest.mock('../../utils/yarn');

const cwd = 'dummy/path/to/dir';
const commandArgs = ['react'];
const flags = { cwd, json: true };

describe('bolt info', () => {
  test('should call npm login once', async () => {
    await info({ flags, commandArgs });
    expect(yarn.info).toHaveBeenCalledTimes(1);
  });
});
