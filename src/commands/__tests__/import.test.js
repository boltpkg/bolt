// @flow
import { import_, toImportOptions } from '../import';
import * as yarn from '../../utils/yarn';

jest.mock('../../utils/yarn');

const projectDirMock = 'dummyPattern/dummyPath';

describe('bolt import', () => {
  it('should call yarn cliCommand with autoClean and path to project', async () => {
    await import_(toImportOptions([], { cwd: projectDirMock }));
    expect(yarn.cliCommand).toHaveBeenCalledWith(projectDirMock, 'import');
  });
});
