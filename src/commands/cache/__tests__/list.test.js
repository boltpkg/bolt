// @flow
import { cacheList } from '../list';
import * as yarn from '../../../utils/yarn';

jest.mock('../../../utils/yarn');

describe('bolt cache list', () => {
  it('should handle situation where no arguments are passed', async () => {
    await cacheList(
      {
        cwd: 'dummyPattern/dummyPath'
      },
      []
    );
    expect(
      yarn.cliCommand
    ).toHaveBeenCalledWith('dummyPattern/dummyPath', 'cache', ['list']);
  });

  it('should handle --pattern flag', async () => {
    await cacheList(
      {
        cwd: 'dummyPattern/dummyPath',
        pattern: 'jest'
      },
      []
    );
    expect(
      yarn.cliCommand
    ).toHaveBeenCalledWith('dummyPattern/dummyPath', 'cache', [
      'list',
      '--pattern=jest'
    ]);
  });
});
