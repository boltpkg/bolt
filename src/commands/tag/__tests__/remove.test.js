// @flow
import { tagRemove, toTagRemoveOptions } from '../remove';
import * as yarn from '../../../utils/yarn';
import { BoltError } from '../../../utils/errors';

jest.mock('../../../utils/yarn');

const dummyPath = '/dummyPattern/dummyPath';
test('bolt tag remove', async () => {
  let tag = await tagRemove(
    toTagRemoveOptions(['test-tag', 'stable'], { cwd: dummyPath })
  );
  expect(yarn.cliCommand).toHaveBeenCalledWith(dummyPath, 'tag', [
    'remove',
    'test-tag',
    'stable'
  ]);
});
