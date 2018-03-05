// @flow
import { why } from '../why';
import * as yarn from '../../utils/yarn';

jest.mock('../../utils/yarn');

describe('bolt why', () => {
  it('should be able to handle arguments', async () => {
    await why({
      flags: {
        cwd: 'dummyPattern/dummyPath'
      },
      commandArgs: ['jest']
    });
    expect(
      yarn.cliCommand
    ).toHaveBeenCalledWith('dummyPattern/dummyPath', 'why', ['jest']);
  });
});
