// @flow
import { teamAdd, toTeamAddOptions } from '../add';
import * as npm from '../../../utils/npm';
import { BoltError } from '../../../utils/errors';

jest.mock('../../../utils/npm');

const dummyPath = '/dummyPattern/dummyPath';
test('bolt team add', async () => {
  let team = await teamAdd(
    toTeamAddOptions(['test-tag', 'user1'], { cwd: dummyPath })
  );
  expect(npm.cliCommand).toHaveBeenCalledWith(dummyPath, 'team', [
    'add',
    'test-tag',
    'user1'
  ]);
});
