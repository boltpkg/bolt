// @flow
import { teamDestroy, toTeamDestroyOptions } from '../destroy';
import * as npm from '../../../utils/npm';
import { BoltError } from '../../../utils/errors';

jest.mock('../../../utils/npm');

const dummyPath = '/dummyPattern/dummyPath';
test('bolt team destroy', async () => {
  let team = await teamDestroy(
    toTeamDestroyOptions(['test-tag'], { cwd: dummyPath })
  );
  expect(npm.cliCommand).toHaveBeenCalledWith(dummyPath, 'team', [
    'destroy',
    'test-tag'
  ]);
});
