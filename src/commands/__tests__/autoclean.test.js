// @flow

import { autoclean } from '../autoclean';
import * as yarn from '../../utils/yarn';

jest.mock('../../utils/yarn');

const projectDirMock = 'dummyPattern/dummyPath';

describe('bolt autoclean', () => {
  it('should call yarn cliCommand with autoClean and path to project', async () => {
    await autoclean({ flags: { cwd: projectDirMock } });
    expect(yarn.cliCommand).toHaveBeenCalledWith(projectDirMock, 'autoclean');
  });
});
