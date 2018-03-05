// @flow
import { cacheDir } from '../dir';
import * as yarn from '../../../utils/yarn';

jest.mock('../../../utils/yarn');

describe('bolt cache dir', () => {
  it('should call yarn cache with dir command', async () => {
    await cacheDir({
      flags: {
        cwd: 'dummyPattern/dummyPath'
      },
      subCommandArgs: []
    });
    expect(
      yarn.cliCommand
    ).toHaveBeenCalledWith('dummyPattern/dummyPath', 'cache', ['dir']);
  });
});
