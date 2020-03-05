// @flow
import { globalUpgrade, toGlobalUpgradeOptions } from '../upgrade';
import * as yarn from '../../../utils/yarn';
import { BoltError } from '../../../utils/errors';

jest.mock('../../../utils/yarn');

const dummyPath = '/dummyPattern/dummyPath';
test('bolt global upgrade', async () => {
  let tag = await globalUpgrade(
    toGlobalUpgradeOptions(['test-tag'], { cwd: dummyPath })
  );
  expect(yarn.globalCli).toHaveBeenCalledWith('upgrade', [
    { name: 'test-tag' }
  ]);
});
