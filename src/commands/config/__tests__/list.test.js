// @flow
import { configList, toConfigListOptions } from '../list';
import * as yarn from '../../../utils/yarn';
import { BoltError } from '../../../utils/errors';

jest.mock('../../../utils/yarn');

const dummyPath = '/dummyPattern/dummyPath';
test('bolt config list', async () => {
  let config = await configList({ cwd: dummyPath });
  expect(yarn.cliCommand).toHaveBeenCalledWith(dummyPath, 'config', ['list']);
});
