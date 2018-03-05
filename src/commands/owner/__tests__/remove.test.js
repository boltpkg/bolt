// @flow
import { ownerRemove } from '../remove';
import * as yarn from '../../../utils/yarn';

jest.mock('../../../utils/yarn');

const dummyPath = '/dummyPattern/dummyPath';
test('bolt owner remove', async () => {
  await ownerRemove({
    flags: { cwd: dummyPath },
    subCommandArgs: ['test-owner', 'stable']
  });
  expect(yarn.cliCommand).toHaveBeenCalledWith(dummyPath, 'owner', [
    'remove',
    'test-owner',
    'stable'
  ]);
});
