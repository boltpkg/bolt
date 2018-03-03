// @flow
import { configCurrent } from '../current';
import * as yarn from '../../../utils/yarn';
import { BoltError } from '../../../utils/errors';

jest.mock('../../../utils/yarn');

const dummyPath = '/dummyPattern/dummyPath';
test('bolt config current', async () => {
  const config = await configCurrent({ cwd: dummyPath }, []);
  expect(yarn.cliCommand).toHaveBeenCalledWith(dummyPath, 'config', [
    'current'
  ]);
});
