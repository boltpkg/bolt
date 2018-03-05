// @flow
import { configList } from '../list';
import * as yarn from '../../../utils/yarn';
import { BoltError } from '../../../utils/errors';

jest.mock('../../../utils/yarn');

const dummyPath = '/dummyPattern/dummyPath';
test('bolt config list', async () => {
  let config = await configList({
    flags: { cwd: dummyPath },
    subCommandArgs: []
  });
  expect(yarn.cliCommand).toHaveBeenCalledWith(dummyPath, 'config', ['list']);
});
