// @flow
import { cacheList, toCacheListOptions } from '../list';
import * as yarn from '../../../utils/yarn';

jest.mock('../../../utils/yarn');

describe('bolt cache list', () => {
  it('should handle situation where no arguments are passed', async () => {
    await cacheList(
      toCacheListOptions([], {
        cwd: 'dummyPattern/dummyPath'
      })
    );
    expect(yarn.cache).toHaveBeenCalledWith(
      'dummyPattern/dummyPath',
      'list',
      []
    );
  });

  it('should handle --pattern flag', async () => {
    await cacheList(
      toCacheListOptions([], {
        cwd: 'dummyPattern/dummyPath',
        pattern: 'jest'
      })
    );
    expect(yarn.cache).toHaveBeenCalledWith('dummyPattern/dummyPath', 'list', [
      '--pattern=jest'
    ]);
  });
});
