// @flow
import { tagList, toTagListOptions } from '../list';
import * as yarn from '../../../utils/yarn';
import { BoltError } from '../../../utils/errors';

jest.mock('../../../utils/yarn');

const dummyPath = '/dummyPattern/dummyPath';
test('bolt tag list', async () => {
  let tag = await tagList(toTagListOptions(['react'], { cwd: dummyPath }));
  expect(yarn.cliCommand).toHaveBeenCalledWith(dummyPath, 'tag', [
    'list',
    'react'
  ]);
});
