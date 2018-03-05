// @flow
import { configGet } from '../get';
import * as yarn from '../../../utils/yarn';
import { BoltError } from '../../../utils/errors';

jest.mock('../../../utils/yarn');

const dummyPath = '/dummyPattern/dummyPath';
test('bolt config get', async () => {
  const config = await configGet({
    flags: { cwd: dummyPath },
    subCommandArgs: ['user-agent']
  });
  expect(yarn.cliCommand).toHaveBeenCalledWith(dummyPath, 'config', [
    'get',
    'user-agent'
  ]);
});
