// @flow
import { globalAdd } from '../add';
import * as yarn from '../../../utils/yarn';
import { BoltError } from '../../../utils/errors';

jest.mock('../../../utils/yarn');

const dummyPath = '/dummyPattern/dummyPath';
test('bolt global add', async () => {
  const tag = await globalAdd({ cwd: dummyPath }, ['test-tag']);
  expect(yarn.globalCli).toHaveBeenCalledWith('add', [{ name: 'test-tag' }]);
});
