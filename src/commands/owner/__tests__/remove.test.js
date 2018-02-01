// @flow
import { ownerRemove, toOwnerRemoveOptions } from '../remove';
import * as yarn from '../../../utils/yarn';

jest.mock('../../../utils/yarn');

const dummyPath = '/dummyPattern/dummyPath';
test('bolt owner remove', async () => {
  await ownerRemove(
    toOwnerRemoveOptions(['test-owner', 'stable'], { cwd: dummyPath })
  );
  expect(yarn.cliCommand).toHaveBeenCalledWith(dummyPath, 'owner', [
    'remove',
    'test-owner',
    'stable'
  ]);
});
