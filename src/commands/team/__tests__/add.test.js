// @flow
import { teamAdd } from '../add';
import * as npm from '../../../utils/npm';
import { BoltError } from '../../../utils/errors';

jest.mock('../../../utils/npm');

const dummyPath = '/dummyPattern/dummyPath';
test('bolt team add', async () => {
  const team = await teamAdd({
    flags: { cwd: dummyPath },
    subCommandArgs: ['test-tag', 'user1']
  });
  expect(npm.cliCommand).toHaveBeenCalledWith(dummyPath, 'team', [
    'add',
    'test-tag',
    'user1'
  ]);
});
