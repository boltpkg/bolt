// @flow
import { ownerAdd, toOwnerAddOptions } from '../add';
import * as yarn from '../../../utils/yarn';

jest.mock('../../../utils/yarn');

const dummyPath = '/dummyPattern/dummyPath';
test('bolt owner add', async () => {
  await ownerAdd(
    toOwnerAddOptions(['test-owner@1.0.0', 'stable'], { cwd: dummyPath })
  );
  expect(yarn.cliCommand).toHaveBeenCalledWith(dummyPath, 'owner', [
    'add',
    'test-owner@1.0.0',
    'stable'
  ]);
});
