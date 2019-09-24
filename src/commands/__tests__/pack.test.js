// @flow
import { pack, toPackOptions } from '../pack';
import * as yarn from '../../utils/yarn';

jest.mock('../../utils/yarn');

describe('bolt pack', () => {
  it('should be able to handle filename flag', async () => {
    await pack(
      toPackOptions([], {
        cwd: 'dummyPattern/dummyPath',
        filename: 'my-app'
      })
    );
    expect(yarn.cliCommand).toHaveBeenCalledWith(
      'dummyPattern/dummyPath',
      'pack',
      ['--filename=my-app']
    );
  });
});
