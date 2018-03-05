// @flow
import { globalRemove } from '../remove';
import * as yarn from '../../../utils/yarn';
import { BoltError } from '../../../utils/errors';

jest.mock('../../../utils/yarn');

const dummyPath = '/dummyPattern/dummyPath';
test('bolt global remove', async () => {
  const tag = await globalRemove({
    flags: { cwd: dummyPath },
    subCommandArgs: ['test-tag']
  });
  expect(yarn.globalCli).toHaveBeenCalledWith('remove', [{ name: 'test-tag' }]);
});
