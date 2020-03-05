// @flow
import { teamCreate, toTeamCreateOptions } from '../create';
import * as npm from '../../../utils/npm';
import { BoltError } from '../../../utils/errors';

jest.mock('../../../utils/npm');

const dummyPath = '/dummyPattern/dummyPath';
test('bolt team create', async () => {
  let team = await teamCreate(
    toTeamCreateOptions(['test-tag'], { cwd: dummyPath })
  );
  expect(npm.cliCommand).toHaveBeenCalledWith(dummyPath, 'team', [
    'create',
    'test-tag'
  ]);
});
