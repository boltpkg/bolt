// @flow
import { teamRemove } from '../remove';
import * as npm from '../../../utils/npm';
import { BoltError } from '../../../utils/errors';

jest.mock('../../../utils/npm');

const dummyPath = '/dummyPattern/dummyPath';
test('bolt team remove', async () => {
  const team = await teamRemove({ cwd: dummyPath }, ['test-tag', 'user1']);
  expect(npm.cliCommand).toHaveBeenCalledWith(dummyPath, 'team', [
    'rm',
    'test-tag',
    'user1'
  ]);
});
