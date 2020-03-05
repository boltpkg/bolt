// @flow
import { configCurrent, toConfigCurrentOptions } from '../current';
import * as yarn from '../../../utils/yarn';
import { BoltError } from '../../../utils/errors';

jest.mock('../../../utils/yarn');

const dummyPath = '/dummyPattern/dummyPath';
test('bolt config current', async () => {
  let config = await configCurrent({ cwd: dummyPath });
  expect(yarn.cliCommand).toHaveBeenCalledWith(dummyPath, 'config', [
    'current'
  ]);
});
