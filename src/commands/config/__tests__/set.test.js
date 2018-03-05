// @flow
import { configSet } from '../set';
import * as yarn from '../../../utils/yarn';
import { BoltError } from '../../../utils/errors';

jest.mock('../../../utils/yarn');

const dummyPath = '/dummyPattern/dummyPath';
test('bolt config set', async () => {
  const config = await configSet({
    flags: { cwd: dummyPath },
    subCommandArgs: ['user.email', 'test@example.com']
  });
  expect(yarn.cliCommand).toHaveBeenCalledWith(dummyPath, 'config', [
    'set',
    'user.email',
    'test@example.com'
  ]);
});
