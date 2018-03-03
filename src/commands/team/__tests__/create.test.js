// @flow
import { teamCreate } from '../create';
import * as npm from '../../../utils/npm';
import { BoltError } from '../../../utils/errors';

jest.mock('../../../utils/npm');

const dummyPath = '/dummyPattern/dummyPath';
test('bolt team create', async () => {
  const team = await teamCreate({ cwd: dummyPath }, ['test-tag']);
  expect(npm.cliCommand).toHaveBeenCalledWith(dummyPath, 'team', [
    'create',
    'test-tag'
  ]);
});
