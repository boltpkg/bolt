// @flow
import { configDelete } from '../delete';
import * as yarn from '../../../utils/yarn';
import { BoltError } from '../../../utils/errors';

jest.mock('../../../utils/yarn');

const dummyPath = '/dummyPattern/dummyPath';
test('bolt config delete', async () => {
  const config = await configDelete({
    flags: { cwd: dummyPath },
    subCommandArgs: ['user-agent']
  });
  expect(yarn.cliCommand).toHaveBeenCalledWith(dummyPath, 'config', [
    'delete',
    'user-agent'
  ]);
});
