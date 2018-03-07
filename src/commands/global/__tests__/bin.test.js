// @flow
import { globalBin, toGlobalBinOptions } from '../bin';
import * as yarn from '../../../utils/yarn';
import { BoltError } from '../../../utils/errors';

jest.mock('../../../utils/yarn');

const dummyPath = '/dummyPattern/dummyPath';
test('bolt global bin', async () => {
  let tag = await globalBin(toGlobalBinOptions([], { cwd: dummyPath }));
  expect(yarn.cliCommand).toHaveBeenCalledWith(dummyPath, 'global', ['bin']);
});
