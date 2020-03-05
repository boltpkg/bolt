// @flow
import { globalList, toGlobalListOptions } from '../list';
import * as yarn from '../../../utils/yarn';
import { BoltError } from '../../../utils/errors';

jest.mock('../../../utils/yarn');

const dummyPath = '/dummyPattern/dummyPath';
test('bolt global list', async () => {
  let tag = await globalList(
    toGlobalListOptions(['test-tag'], { cwd: dummyPath })
  );
  expect(yarn.cliCommand).toHaveBeenCalledWith(dummyPath, 'global', [
    'list',
    'test-tag'
  ]);
});
