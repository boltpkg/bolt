// @flow
import { globalList } from '../list';
import * as yarn from '../../../utils/yarn';
import { BoltError } from '../../../utils/errors';

jest.mock('../../../utils/yarn');

const dummyPath = '/dummyPattern/dummyPath';
test('bolt global list', async () => {
  const tag = await globalList({
    flags: { cwd: dummyPath },
    subCommandArgs: ['test-tag']
  });
  expect(yarn.cliCommand).toHaveBeenCalledWith(dummyPath, 'global', [
    'list',
    'test-tag'
  ]);
});
