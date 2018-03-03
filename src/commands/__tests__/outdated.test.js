// @flow
import { outdated } from '../outdated';
import * as yarn from '../../utils/yarn';

jest.mock('../../utils/yarn');

describe('bolt outdated', () => {
  it('should be able to pass arguments to yarn outdated', async () => {
    await outdated(
      {
        cwd: 'dummyPattern/dummyPath'
      },
      ['jest']
    );
    expect(
      yarn.cliCommand
    ).toHaveBeenCalledWith('dummyPattern/dummyPath', 'outdated', ['jest']);
  });
});
