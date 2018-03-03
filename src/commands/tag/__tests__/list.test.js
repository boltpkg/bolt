// @flow
import { tagList } from '../list';
import * as yarn from '../../../utils/yarn';
import { BoltError } from '../../../utils/errors';

jest.mock('../../../utils/yarn');

const dummyPath = '/dummyPattern/dummyPath';
test('bolt tag list', async () => {
  const tag = await tagList({ cwd: dummyPath }, ['react']);
  expect(yarn.cliCommand).toHaveBeenCalledWith(dummyPath, 'tag', [
    'list',
    'react'
  ]);
});
