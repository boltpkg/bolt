// @flow

import { copyFixtureIntoTempDir } from 'jest-fixtures';
import path from 'path';

import addDependenciesToPackage from '../addDependenciesToPackages';
import * as symlinkPackageDependencies from '../symlinkPackageDependencies';
import * as yarn from '../yarn';
import Project from '../../Project';
import Package from '../../Package';
import Config from '../../Config';

jest.mock('../yarn');
jest.mock('../logger');

const unsafeYarn: any & typeof yarn = yarn;

// Mock yarn.add to make it update the packages config when called
function fakeYarnAdd(pkg, dependencies, type = 'dependencies') {
  pkg.config.json[type] = pkg.config.json[type] || {};

  dependencies.forEach(dep => {
    pkg.config.json[type][dep.name] = dep.version || '^1.0.0';
  });
}

function assertSingleYarnAddCall(expectedPkg, expectedDeps) {
  const yarnAddCalls = unsafeYarn.add.mock.calls;

  expect(yarnAddCalls.length).toEqual(1);
  expect(yarnAddCalls[0][0]).toEqual(expectedPkg);
  expect(yarnAddCalls[0][1]).toEqual(expectedDeps);
}

describe('utils/addDependenciesToPackages', () => {
  let symlinkSpy;

  beforeEach(() => {
    unsafeYarn.add.mockImplementation(fakeYarnAdd);
    symlinkSpy = jest.spyOn(symlinkPackageDependencies, 'default');
  });

  test('it should just yarn add at the root when run from the root of a project', async () => {
    const cwd = await copyFixtureIntoTempDir(__dirname, 'nested-workspaces');
    const project = await Project.init(cwd);

    await addDependenciesToPackage(project, project.pkg, [{ name: 'chalk' }]);

    expect(unsafeYarn.add).toHaveBeenCalledTimes(1);
    expect(unsafeYarn.add).toHaveBeenCalledWith(
      project.pkg,
      [{ name: 'chalk' }],
      'dependencies'
    );
  });

  test('it should still run yarn add at the root when run from another package', async () => {
    const rootDir = await copyFixtureIntoTempDir(
      __dirname,
      'nested-workspaces'
    );
    const project = await Project.init(rootDir);
    const workspaces = await project.getWorkspaces();
    const wsToRunIn = project.getWorkspaceByName(workspaces, 'foo') || {};

    await addDependenciesToPackage(project, wsToRunIn.pkg, [{ name: 'chalk' }]);

    expect(unsafeYarn.add).toHaveBeenCalledTimes(1);
    expect(unsafeYarn.add).toHaveBeenCalledWith(
      project.pkg,
      [{ name: 'chalk' }],
      'dependencies'
    );
  });

  test('it should not yarn install packages that are already installed', async () => {
    const cwd = await copyFixtureIntoTempDir(__dirname, 'nested-workspaces');
    const project = await Project.init(cwd);

    await addDependenciesToPackage(project, project.pkg, [{ name: 'react' }]);

    expect(unsafeYarn.add).toHaveBeenCalledWith(
      project.pkg,
      [],
      'dependencies'
    );
  });

  test('it should throw if version does not match version in project config', async () => {
    const cwd = await copyFixtureIntoTempDir(__dirname, 'nested-workspaces');
    const project = await Project.init(cwd);
    const workspaces = await project.getWorkspaces();
    const wsToAddTo = project.getWorkspaceByName(workspaces, 'foo') || {};

    await expect(
      addDependenciesToPackage(project, wsToAddTo.pkg, [
        { name: 'left-pad', version: '2.0.0' }
      ])
    ).rejects.toBeInstanceOf(Error);
  });

  test('should call symlinkPackageDependencies to symlink dependencies in workspace', async () => {
    const cwd = await copyFixtureIntoTempDir(__dirname, 'nested-workspaces');
    const project = await Project.init(cwd);
    const workspaces = await project.getWorkspaces();
    const wsToAddTo = project.getWorkspaceByName(workspaces, 'foo') || {};

    await addDependenciesToPackage(project, wsToAddTo.pkg, [{ name: 'chalk' }]);

    expect(symlinkSpy).toHaveBeenCalledWith(project, wsToAddTo.pkg, ['chalk']);
  });

  test('should update packages dependencies in package config', async () => {
    const cwd = await copyFixtureIntoTempDir(__dirname, 'nested-workspaces');
    const project = await Project.init(cwd);
    const workspaces = await project.getWorkspaces();
    const wsToAddTo = project.getWorkspaceByName(workspaces, 'foo') || {};

    expect(wsToAddTo.pkg.getDependencyVersionRange('chalk')).toEqual(null);
    await addDependenciesToPackage(project, wsToAddTo.pkg, [{ name: 'chalk' }]);

    expect(symlinkSpy).toHaveBeenCalledWith(project, wsToAddTo.pkg, ['chalk']);
    expect(wsToAddTo.pkg.getDependencyVersionRange('chalk')).toEqual('^1.0.0');
  });

  describe('when adding internal package', () => {
    test('should set version as current version of internal package', async () => {
      // i.e if we have bar 1.0.0 installed locally addDependenciesToPackages should add ^1.0.0
      const cwd = await copyFixtureIntoTempDir(__dirname, 'nested-workspaces');
      const project = await Project.init(cwd);
      const workspaces = await project.getWorkspaces();
      const wsToAddTo = project.getWorkspaceByName(workspaces, 'bar') || {};

      expect(wsToAddTo.pkg.getDependencyVersionRange('baz')).toEqual(null);
      await addDependenciesToPackage(project, wsToAddTo.pkg, [{ name: 'baz' }]);

      expect(symlinkSpy).toHaveBeenCalledWith(project, wsToAddTo.pkg, ['baz']);
      expect(wsToAddTo.pkg.getDependencyVersionRange('baz')).toEqual('^1.0.1');
    });

    test('should throw if attempting to set to version that doesnt match local', async () => {
      const cwd = await copyFixtureIntoTempDir(__dirname, 'nested-workspaces');
      const project = await Project.init(cwd);
      const workspaces = await project.getWorkspaces();
      const wsToAddTo = project.getWorkspaceByName(workspaces, 'bar') || {};

      await expect(
        addDependenciesToPackage(project, wsToAddTo.pkg, [
          { name: 'baz', version: '^1.0.0' }
        ])
      ).rejects.toBeInstanceOf(Error);
    });

    test('should not add internal to root package', async () => {
      const cwd = await copyFixtureIntoTempDir(__dirname, 'nested-workspaces');
      const project = await Project.init(cwd);
      const workspaces = await project.getWorkspaces();
      const wsToAddTo = project.getWorkspaceByName(workspaces, 'bar') || {};

      expect(project.pkg.getDependencyVersionRange('baz')).toEqual(null);
      await addDependenciesToPackage(project, wsToAddTo.pkg, [{ name: 'baz' }]);
      expect(project.pkg.getDependencyVersionRange('baz')).toEqual(null);
      expect(unsafeYarn.add).toHaveBeenCalledWith(
        project.pkg,
        [],
        'dependencies'
      );
    });
  });
});
