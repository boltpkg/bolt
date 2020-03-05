// @flow
import { create, toCreateOptions } from '../create';
import * as yarn from '../../utils/yarn';

jest.mock('../../utils/yarn');

describe('bolt create', () => {
  it('should be able to pass down arguments down to yarn create', async () => {
    await create(
      toCreateOptions(['react-app', 'my-app'], {
        cwd: 'dummyPattern/dummyPath'
      })
    );
    expect(yarn.cliCommand).toHaveBeenCalledWith(
      'dummyPattern/dummyPath',
      'create',
      ['react-app', 'my-app']
    );
  });
});
