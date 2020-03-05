// @flow
import { teamRemove, toTeamRemoveOptions } from '../remove';
import * as npm from '../../../utils/npm';
import { BoltError } from '../../../utils/errors';

jest.mock('../../../utils/npm');

const dummyPath = '/dummyPattern/dummyPath';
test('bolt team remove', async () => {
  let team = await teamRemove(
    toTeamRemoveOptions(['test-tag', 'user1'], { cwd: dummyPath })
  );
  expect(npm.cliCommand).toHaveBeenCalledWith(dummyPath, 'team', [
    'rm',
    'test-tag',
    'user1'
  ]);
});
