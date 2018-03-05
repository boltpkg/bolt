// @flow
import { globalBin } from '../bin';
import * as yarn from '../../../utils/yarn';
import { BoltError } from '../../../utils/errors';

jest.mock('../../../utils/yarn');

const dummyPath = '/dummyPattern/dummyPath';
test('bolt global bin', async () => {
  const tag = await globalBin({
    flags: { cwd: dummyPath },
    subCommandArgs: []
  });
  expect(yarn.cliCommand).toHaveBeenCalledWith(dummyPath, 'global', ['bin']);
});
