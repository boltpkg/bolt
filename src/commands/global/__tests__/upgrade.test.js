// @flow
import { globalUpgrade } from '../upgrade';
import * as yarn from '../../../utils/yarn';
import { BoltError } from '../../../utils/errors';

jest.mock('../../../utils/yarn');

const dummyPath = '/dummyPattern/dummyPath';
test('bolt global upgrade', async () => {
  const tag = await globalUpgrade({ cwd: dummyPath }, ['test-tag']);
  expect(yarn.globalCli).toHaveBeenCalledWith('upgrade', [
    { name: 'test-tag' }
  ]);
});
