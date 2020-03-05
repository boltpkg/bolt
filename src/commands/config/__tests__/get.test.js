// @flow
import { configGet, toConfigGetOptions } from '../get';
import * as yarn from '../../../utils/yarn';
import { BoltError } from '../../../utils/errors';

jest.mock('../../../utils/yarn');

const dummyPath = '/dummyPattern/dummyPath';
test('bolt config get', async () => {
  let config = await configGet(
    toConfigGetOptions(['user-agent'], { cwd: dummyPath })
  );
  expect(yarn.cliCommand).toHaveBeenCalledWith(dummyPath, 'config', [
    'get',
    'user-agent'
  ]);
});
