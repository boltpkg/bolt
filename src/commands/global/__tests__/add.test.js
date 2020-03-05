// @flow
import { globalAdd, toGlobalAddOptions } from '../add';
import * as yarn from '../../../utils/yarn';
import { BoltError } from '../../../utils/errors';

jest.mock('../../../utils/yarn');

const dummyPath = '/dummyPattern/dummyPath';
test('bolt global add', async () => {
  let tag = await globalAdd(
    toGlobalAddOptions(['test-tag'], { cwd: dummyPath })
  );
  expect(yarn.globalCli).toHaveBeenCalledWith('add', [{ name: 'test-tag' }]);
});
