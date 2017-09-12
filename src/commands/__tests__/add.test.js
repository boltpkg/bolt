// @flow
import { getFixturePath } from 'jest-fixtures';

import { add, toAddOptions } from '../add';
import * as yarn from '../../utils/yarn';
import * as config from '../../utils/config';
import Package from '../../Package';
import Project from '../../Project';

jest.mock('../../utils/yarn');
jest.mock('../../utils/config');
jest.mock('../../utils/logger');

const unsafeYarn: any & typeof yarn = yarn;
const unsafeConfig: any & typeof config = config;

function expectMockAddCall(mockCall, expectedTarget, expectedPkgsToInstall) {
  expect(mockCall[0]).toBeInstanceOf(Package);
  expect(mockCall[0].config.name).toEqual(expectedTarget);
  expect(mockCall[1]).toEqual(expectedPkgsToInstall);
}

describe('pyarn add', () => {
  let projectRoot;
  let project;
  let workspaces;

  beforeEach(async () => {
    projectRoot = await getFixturePath(__dirname, 'simple-project');
    project = await Project.init(projectRoot);
    workspaces = await project.getWorkspaces();
  });

  describe('from the root of a Project', () => {
    it('should simply run `yarn add`', async () => {
      const packagesToAdd = ['chalk'];

      await add({ cwd: projectRoot, pkgs: packagesToAdd });

      const mockCalls = unsafeYarn.add.mock.calls;
      expect(mockCalls.length).toEqual(1);
      expectMockAddCall(mockCalls[0], 'simple-project', ['chalk']);
    });
  });

  describe('from a workspace in a Project', () => {
    describe('if the dependency is already installed in the project', () => {
      it('should add the same version that exists in the Project package', async () => {
        const packagesToAdd = ['left-pad']; // exists in the Project Package @^1.1.3
        const pkgToInstallIn =
          workspaces
            .map(workspace => workspace.pkg)
            .find(pkg => pkg.config.name === 'foo') || {};

        await add({ cwd: pkgToInstallIn.dir, pkgs: packagesToAdd });

        // Should still run install in the Project package
        const mockCalls = unsafeYarn.add.mock.calls;
        expect(mockCalls.length).toEqual(1);
        expectMockAddCall(mockCalls[0], 'simple-project', ['left-pad']);
        expect(unsafeConfig.writeConfigFile.mock.calls.length).toEqual(1);

        const writtenPkg = unsafeConfig.writeConfigFile.mock.calls[0][1];
        expect(writtenPkg.dependencies['left-pad']).toEqual('^1.1.3');
      });
    });

    describe('if the package is not installed in the project', () => {
      it('should add to project package and target package', async () => {
        const packagesToAdd = ['chalk'];
        const pkgToInstallIn =
          workspaces
            .map(workspace => workspace.pkg)
            .find(pkg => pkg.config.name === 'foo') || {};

        await add({ cwd: pkgToInstallIn.dir, pkgs: packagesToAdd });

        // Should install in the Project package
        const mockAddCalls = unsafeYarn.add.mock.calls;
        expect(mockAddCalls.length).toEqual(1);
        expectMockAddCall(mockAddCalls[0], 'simple-project', ['chalk']);

        // And also in the target package
        const mockConfigCalls = unsafeConfig.writeConfigFile.mock.calls;
        expect(mockConfigCalls.length).toEqual(1);
        expect(mockConfigCalls[0][0].startsWith(pkgToInstallIn.dir)).toEqual(
          true
        );
        // This should really be checking that it installs the same version, but will require some
        // refactoring
        expect(mockConfigCalls[0][1].dependencies.chalk).toBeDefined();
      });
    });
  });
});
