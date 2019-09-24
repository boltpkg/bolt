// @flow
import { cacheDir, toCacheDirOptions } from '../dir';
import * as yarn from '../../../utils/yarn';

jest.mock('../../../utils/yarn');

describe('bolt cache dir', () => {
  it('should call yarn cache with dir command', async () => {
    await cacheDir(
      toCacheDirOptions([], {
        cwd: 'dummyPattern/dummyPath'
      })
    );
    expect(yarn.cliCommand).toHaveBeenCalledWith(
      'dummyPattern/dummyPath',
      'cache',
      ['dir']
    );
  });
});
