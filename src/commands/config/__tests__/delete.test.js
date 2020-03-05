// @flow
import { configDelete, toConfigDeleteOptions } from '../delete';
import * as yarn from '../../../utils/yarn';
import { BoltError } from '../../../utils/errors';

jest.mock('../../../utils/yarn');

const dummyPath = '/dummyPattern/dummyPath';
test('bolt config delete', async () => {
  let config = await configDelete(
    toConfigDeleteOptions(['user-agent'], { cwd: dummyPath })
  );
  expect(yarn.cliCommand).toHaveBeenCalledWith(dummyPath, 'config', [
    'delete',
    'user-agent'
  ]);
});
