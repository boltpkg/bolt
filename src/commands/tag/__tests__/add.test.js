// @flow
import { tagAdd, toTagAddOptions } from '../add';
import * as yarn from '../../../utils/yarn';
import { BoltError } from '../../../utils/errors';

jest.mock('../../../utils/yarn');

const dummyPath = '/dummyPattern/dummyPath';
test('bolt tag add', async () => {
  let tag = await tagAdd(
    toTagAddOptions(['test-tag@1.0.0', 'stable'], { cwd: dummyPath })
  );
  expect(yarn.cliCommand).toHaveBeenCalledWith(dummyPath, 'tag', [
    'add',
    'test-tag@1.0.0',
    'stable'
  ]);
});
