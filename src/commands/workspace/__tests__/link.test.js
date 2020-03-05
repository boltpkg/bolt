// @flow

import { toWorkspacelinkOptions, workspacelink } from '../link';
import * as path from 'path';
import * as PackageLink from '../../link';
import * as yarn from '../../../utils/yarn';
import fixtures from 'fixturez';

const f = fixtures(__dirname);

jest.mock('../../../utils/yarn');
jest.mock('../../link');

describe('workspace link', () => {
  let projectDir;
  beforeEach(async () => {
    projectDir = f.copy('package-with-external-deps-installed');
  });

  it('should create link to package if there are no packages to link in args', async () => {
    let pathToFooWorksapce = path.join(projectDir, 'packages', 'foo');
    await workspacelink(toWorkspacelinkOptions(['foo'], { cwd: projectDir }));
    expect(yarn.cliCommand).toHaveBeenCalledWith(pathToFooWorksapce, 'link');
  });

  it('should link packages to root of project', async () => {
    await workspacelink(
      toWorkspacelinkOptions(['foo', 'some-external-package'], {
        cwd: projectDir
      })
    );
    expect(PackageLink.toLinkOptions).toHaveBeenCalledWith(
      ['some-external-package'],
      { '--': [] }
    );
  });
});
