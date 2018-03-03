// @flow
import { create } from '../create';
import * as yarn from '../../utils/yarn';

jest.mock('../../utils/yarn');

describe('bolt create', () => {
  it('should be able to pass down arguments down to yarn create', async () => {
    await create(
      {
        cwd: 'dummyPattern/dummyPath'
      },
      ['react-app', 'my-app']
    );
    expect(
      yarn.cliCommand
    ).toHaveBeenCalledWith('dummyPattern/dummyPath', 'create', [
      'react-app',
      'my-app'
    ]);
  });
});
