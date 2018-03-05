// @flow
import { import_ } from '../import';
import * as yarn from '../../utils/yarn';

jest.mock('../../utils/yarn');

const projectDirMock = 'dummyPattern/dummyPath';

describe('bolt import', () => {
  it('should call yarn cliCommand with autoClean and path to project', async () => {
    await import_({ flags: { cwd: projectDirMock } });
    expect(yarn.cliCommand).toHaveBeenCalledWith(projectDirMock, 'import');
  });
});
