// @flow
import { globalRemove, toGlobalRemoveOptions } from '../remove';
import * as yarn from '../../../utils/yarn';
import { BoltError } from '../../../utils/errors';

jest.mock('../../../utils/yarn');

const dummyPath = '/dummyPattern/dummyPath';
test('bolt global remove', async () => {
  let tag = await globalRemove(
    toGlobalRemoveOptions(['test-tag'], { cwd: dummyPath })
  );
  expect(yarn.globalCli).toHaveBeenCalledWith('remove', [{ name: 'test-tag' }]);
});
