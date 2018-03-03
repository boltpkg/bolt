// @flow
import { teamDestroy } from '../destroy';
import * as npm from '../../../utils/npm';
import { BoltError } from '../../../utils/errors';

jest.mock('../../../utils/npm');

const dummyPath = '/dummyPattern/dummyPath';
test('bolt team destroy', async () => {
  const team = await teamDestroy({ cwd: dummyPath }, ['test-tag']);
  expect(npm.cliCommand).toHaveBeenCalledWith(dummyPath, 'team', [
    'destroy',
    'test-tag'
  ]);
});
