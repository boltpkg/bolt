// @flow
import { why } from '../why';
import * as yarn from '../../utils/yarn';

jest.mock('../../utils/yarn');

describe('bolt why', () => {
  it('should be able to handle arguments', async () => {
    await why(
      {
        cwd: 'dummyPattern/dummyPath'
      },
      ['jest']
    );
    expect(
      yarn.cliCommand
    ).toHaveBeenCalledWith('dummyPattern/dummyPath', 'why', ['jest']);
  });
});
