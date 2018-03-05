// @flow
import { cacheList } from '../list';
import * as yarn from '../../../utils/yarn';

jest.mock('../../../utils/yarn');

describe('bolt cache list', () => {
  it('should handle situation where no arguments are passed', async () => {
    await cacheList({
      flags: {
        cwd: 'dummyPattern/dummyPath'
      },
      subCommandArgs: []
    });
    expect(
      yarn.cliCommand
    ).toHaveBeenCalledWith('dummyPattern/dummyPath', 'cache', ['list']);
  });

  it('should handle --pattern flag', async () => {
    await cacheList({
      flags: {
        cwd: 'dummyPattern/dummyPath',
        pattern: 'jest'
      },
      subCommandArgs: []
    });
    expect(
      yarn.cliCommand
    ).toHaveBeenCalledWith('dummyPattern/dummyPath', 'cache', [
      'list',
      '--pattern=jest'
    ]);
  });
});
