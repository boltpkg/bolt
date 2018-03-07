// @flow
import { teamList, toTeamListOptions } from '../list';
import * as npm from '../../../utils/npm';
import { BoltError } from '../../../utils/errors';

jest.mock('../../../utils/npm');

const dummyPath = '/dummyPattern/dummyPath';
test('bolt team list', async () => {
  let team = await teamList(
    toTeamListOptions(['test-tag'], { cwd: dummyPath })
  );
  expect(npm.cliCommand).toHaveBeenCalledWith(dummyPath, 'team', [
    'ls',
    'test-tag'
  ]);
});
