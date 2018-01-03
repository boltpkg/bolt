// @flow

import { toWorkspaceUnlinkOptions, workspaceUnlink } from '../unlink';
import * as path from 'path';
import * as yarn from '../../../utils/yarn';
import * as PackageUnlink from '../../unlink';
import { copyFixtureIntoTempDir } from 'jest-fixtures';

jest.mock('../../../utils/yarn');
jest.mock('../../unlink');

describe('workspace unlink', () => {
  let projectDir;
  beforeEach(async () => {
    projectDir = await copyFixtureIntoTempDir(
      __dirname,
      'package-with-external-deps-installed'
    );
  });

  it('should unlink the package if there are no packages to unlink in args', async () => {
    const pathToFooWorksapce = path.join(projectDir, 'packages', 'foo');
    await workspaceUnlink(
      toWorkspaceUnlinkOptions(['foo'], { cwd: projectDir })
    );
    expect(yarn.unlink).toHaveBeenCalledWith(pathToFooWorksapce);
  });

  it('should link packages to root of project', async () => {
    await workspaceUnlink(
      toWorkspaceUnlinkOptions(['foo', 'some-external-package'], {
        cwd: projectDir
      })
    );
    expect(PackageUnlink.toUnlinkOptions).toHaveBeenCalledWith(
      ['some-external-package'],
      { '--': [] }
    );
  });
});
