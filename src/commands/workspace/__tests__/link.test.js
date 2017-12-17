//@flow
import { workspaceLink } from '../link';
import { copyFixtureIntoTempDir } from 'jest-fixtures';
import * as processes from '../../../utils/processes';
import * as path from 'path';
import * as yarn from '../../../utils/yarn';

jest.mock('../../../utils/logger');
jest.mock('../../../utils/yarn');

const unsafeProcessses: any & typeof processes = processes;
const unsafeYarn: any & typeof yarn = yarn;

describe('bolt worksplace link', () => {
  let projectDir;
  let projectDirBar;
  let projectDirFoo;
  beforeEach(async () => {
    // In this example there are two workspaces foo and bar
    // and foo is dependent on bar
    projectDir = await copyFixtureIntoTempDir(
      __dirname,
      'package-with-external-deps-installed'
    );
    projectDirBar = path.join(projectDir, 'packages', 'bar');
    projectDirBar = path.join(projectDir, 'packages', 'foo');
  });

  describe('link bar when bar is unlinked', () => {
    beforeEach(async () => {
      await yarn.unLink(projectDirBar);
    });
    test('should successfully link bar for the first time', async () => {
      await workspaceLink({
        cwd: projectDir,
        workspaceName: 'bar',
        packageToLink: ''
      });
      expect(yarn.link).toHaveBeenCalledTimes(1);
    });
    test('should show an error when linking bar in foo', async () => {
      await workspaceLink({
        cwd: projectDir,
        workspaceName: 'foo',
        packageToLink: 'bar'
      });
      expect(yarn.link).toHaveBeenCalledTimes(1);
    });
  });

  describe('link bar when bar is already linked', () => {
    beforeEach(async () => {
      await yarn.link(projectDirBar);
    });
    test('should show error when trying to link bar again', async () => {
      await workspaceLink({
        cwd: projectDir,
        workspaceName: 'bar',
        packageToLink: ''
      });
      expect(yarn.link).toHaveBeenCalled();
    });
    test('should link bar in foo', async () => {
      await workspaceLink({
        cwd: projectDir,
        workspaceName: 'bar',
        packageToLink: 'foo'
      });
      expect(yarn.link).toHaveBeenCalled();
    });
  });
});
