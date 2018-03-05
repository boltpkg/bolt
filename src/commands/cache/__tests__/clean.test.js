// @flow
import { cacheClean } from '../clean';
import * as yarn from '../../../utils/yarn';

jest.mock('../../../utils/yarn');

describe('bolt cache clean', () => {
  it('should handle situation where no arguments are passed', async () => {
    await cacheClean({
      flags: {
        cwd: 'dummyPattern/dummyPath'
      },
      subCommandArgs: []
    });
    expect(
      yarn.cliCommand
    ).toHaveBeenCalledWith('dummyPattern/dummyPath', 'cache', ['clean']);
  });

  it('should handle passing the arguments down to yarn clean', async () => {
    await cacheClean({
      flags: {
        cwd: 'dummyPattern/dummyPath'
      },
      subCommandArgs: ['jest']
    });
    expect(
      yarn.cliCommand
    ).toHaveBeenCalledWith('dummyPattern/dummyPath', 'cache', [
      'clean',
      'jest'
    ]);
  });
});
