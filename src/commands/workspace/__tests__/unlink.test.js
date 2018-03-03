// @flow
import { unlink } from '../unlink';
import * as path from 'path';
import * as yarn from '../../../utils/yarn';
import * as PackageUnlink from '../../unlink';
import fixtures from 'fixturez';

const f = fixtures(__dirname);

jest.mock('../../../utils/yarn');
jest.mock('../../unlink');

describe('workspace unlink', () => {
  let projectDir;

  beforeEach(() => {
    projectDir = f.copy('package-with-external-deps-installed');
  });

  it('should unlink the package if there are no packages to unlink in args', async () => {
    let pathToFooWorksapce = path.join(projectDir, 'packages', 'foo');
    await unlink({ cwd: projectDir }, ['foo']);
    expect(yarn.cliCommand).toHaveBeenCalledWith(pathToFooWorksapce, 'unlink');
  });
});
