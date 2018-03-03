// @flow
import { teamList } from '../list';
import * as npm from '../../../utils/npm';
import { BoltError } from '../../../utils/errors';

jest.mock('../../../utils/npm');

const dummyPath = '/dummyPattern/dummyPath';
test('bolt team list', async () => {
  const team = await teamList({ cwd: dummyPath }, ['test-tag']);
  expect(npm.cliCommand).toHaveBeenCalledWith(dummyPath, 'team', [
    'ls',
    'test-tag'
  ]);
});
