// @flow
import { ownerAdd } from '../add';
import * as yarn from '../../../utils/yarn';

jest.mock('../../../utils/yarn');

const dummyPath = '/dummyPattern/dummyPath';
test('bolt owner add', async () => {
  await ownerAdd({
    flags: { cwd: dummyPath },
    subCommandArgs: ['test-owner@1.0.0', 'stable']
  });
  expect(yarn.cliCommand).toHaveBeenCalledWith(dummyPath, 'owner', [
    'add',
    'test-owner@1.0.0',
    'stable'
  ]);
});
