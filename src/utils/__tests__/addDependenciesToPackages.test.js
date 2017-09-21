// @flow

import { getFixturePath } from 'jest-fixtures';

import addDependenciesToPackage from '../addDependenciesToPackages';
import * as yarn from '../yarn';
import Project from '../../Project';

jest.mock('../yarn');

const unsafeYarn: any & typeof yarn = yarn;

function assertSingleYarnAddCall(expectedPkg, expectedDeps) {
  const yarnAddCalls = unsafeYarn.add.mock.calls;

  expect(yarnAddCalls.length).toEqual(1);
  expect(yarnAddCalls[0][0]).toEqual(expectedPkg);
  expect(yarnAddCalls[0][1]).toEqual(expectedDeps);
}

describe('utils/addDependenciesToPackages', () => {
  describe('addDependenciesToPackage()', () => {
    let cwd;
    let project;
    let projectPkg;
    let workspaces;

    beforeEach(async () => {
      cwd = await getFixturePath(__dirname, 'nested-workspaces');
      project = await Project.init(cwd);
      projectPkg = project.pkg;
      workspaces = await project.getWorkspaces();
    });

    describe('when called from the root of a project', () => {
      it('should just run yarn add in the project dir', async () => {
        const depsToAdd = [{ name: 'chalk' }];
        await addDependenciesToPackage(project, projectPkg, depsToAdd);

        assertSingleYarnAddCall(projectPkg, depsToAdd);
      });
    });

    describe('when called from a workspace', () => {
      let pkgToRunIn;

      beforeEach(() => {
        const workspaceToRunIn =
          project.getWorkspaceByName(workspaces, 'foo') || {};
        pkgToRunIn = workspaceToRunIn.pkg;
      });

      describe('if all packages are already in the root', () => {});

      describe('if some packages are not in the root', () => {
        it('should only run yarn add for missing deps', async () => {
          // our project already has left-pad installed
          const depsToAdd = [{ name: 'chalk' }, { name: 'left-pad' }];

          await addDependenciesToPackage(project, pkgToRunIn, depsToAdd);
          // should only add chalk to root
          assertSingleYarnAddCall(projectPkg, [{ name: 'chalk' }]);
        });
      });

      describe('if all packages are not in the root', () => {
        it('should run yarn add in the root', async () => {
          const depsToAdd = [{ name: 'chalk', name: 'does-not-exist' }];

          await addDependenciesToPackage(project, pkgToRunIn, depsToAdd);

          assertSingleYarnAddCall(projectPkg, depsToAdd);
        });
      });
    });
  });
});
