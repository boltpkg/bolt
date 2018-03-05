// @flow
import { tagRemove } from '../remove';
import * as yarn from '../../../utils/yarn';
import { BoltError } from '../../../utils/errors';

jest.mock('../../../utils/yarn');

const dummyPath = '/dummyPattern/dummyPath';
test('bolt tag remove', async () => {
  const tag = await tagRemove({
    flags: { cwd: dummyPath },
    subCommandArgs: ['test-tag', 'stable']
  });
  expect(yarn.cliCommand).toHaveBeenCalledWith(dummyPath, 'tag', [
    'remove',
    'test-tag',
    'stable'
  ]);
});
