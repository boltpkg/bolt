// @flow
import { tagAdd } from '../add';
import * as yarn from '../../../utils/yarn';
import { BoltError } from '../../../utils/errors';

jest.mock('../../../utils/yarn');

const dummyPath = '/dummyPattern/dummyPath';
test('bolt tag add', async () => {
  const tag = await tagAdd({ cwd: dummyPath }, ['test-tag@1.0.0', 'stable']);
  expect(yarn.cliCommand).toHaveBeenCalledWith(dummyPath, 'tag', [
    'add',
    'test-tag@1.0.0',
    'stable'
  ]);
});
