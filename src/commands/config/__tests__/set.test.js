// @flow
import { configSet, toConfigSetOptions } from '../set';
import * as yarn from '../../../utils/yarn';
import { BoltError } from '../../../utils/errors';

jest.mock('../../../utils/yarn');

const dummyPath = '/dummyPattern/dummyPath';
test('bolt config set', async () => {
  let config = await configSet(
    toConfigSetOptions(['user.email', 'test@example.com'], { cwd: dummyPath })
  );
  expect(yarn.cliCommand).toHaveBeenCalledWith(dummyPath, 'config', [
    'set',
    'user.email',
    'test@example.com'
  ]);
});
