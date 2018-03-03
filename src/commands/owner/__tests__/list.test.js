// @flow
import { ownerList } from '../list';
import * as yarn from '../../../utils/yarn';

jest.mock('../../../utils/yarn');

const dummyPath = '/dummyPattern/dummyPath';
test('bolt owner list', async () => {
  await ownerList({ cwd: dummyPath }, ['react']);
  expect(yarn.cliCommand).toHaveBeenCalledWith(dummyPath, 'owner', [
    'list',
    'react'
  ]);
});
