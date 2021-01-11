// @flow
import path from 'path';

import addDependenciesToPackage from '../addDependenciesToPackages';
import * as symlinkPackageDependencies from '../symlinkPackageDependencies';
import * as yarn from '../yarn';
import Project from '../../Project';
import Package from '../../Package';
import Config from '../../Config';
import fixtures from 'fixturez';

const f = fixtures(__dirname);

jest.mock('../yarn');
jest.mock('../logger');

const unsafeYarn: any & typeof yarn = yarn;

function getVersion(version) {
  if (version === 'latest') {
    return '^2.0.0';
  }
  return version || '^1.0.0';
}

// Mock yarn.add to make it update the packages config when called
async function fakeYarnAdd(pkg, dependencies, type = 'dependencies') {
  for (let dep of dependencies) {
    const dependencyTypes = pkg.getDependencyTypes(dep.name);
    await pkg.setDependencyVersionRange(
      dep.name,
      dependencyTypes.length > 0 ? dependencyTypes[0] : 'dependencies',
      getVersion(dep.version)
    );
  }
}

function assertSingleYarnAddCall(expectedPkg, expectedDeps) {
  let yarnAddCalls = unsafeYarn.add.mock.calls;

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
    let cwd = f.copy('nested-workspaces');
    let project = await Project.init(cwd);

    await addDependenciesToPackage(project, project.pkg, [{ name: 'chalk' }]);

    expect(unsafeYarn.add).toHaveBeenCalledTimes(1);
    expect(unsafeYarn.add).toHaveBeenCalledWith(
      project.pkg,
      [{ name: 'chalk' }],
      'dependencies'
    );
  });

  test('it should still run yarn add at the root when run from another package', async () => {
    let rootDir = f.copy('nested-workspaces');
    let project = await Project.init(rootDir);
    let packages = await project.getPackages();
    let pkg = project.getPackageByName(packages, 'foo');
    if (!pkg) throw new Error('missing foo');

    await addDependenciesToPackage(project, pkg, [{ name: 'chalk' }]);

    expect(unsafeYarn.add).toHaveBeenCalledTimes(1);
    expect(unsafeYarn.add).toHaveBeenCalledWith(
      project.pkg,
      [{ name: 'chalk' }],
      'dependencies'
    );
  });

  test('it should not yarn install packages that are already installed when run from a workspace', async () => {
    let rootDir = f.copy('nested-workspaces');
    let project = await Project.init(rootDir);
    let packages = await project.getPackages();
    let pkg = project.getPackageByName(packages, 'foo');
    if (!pkg) throw new Error('missing foo');

    await addDependenciesToPackage(project, pkg, [{ name: 'react' }]);

    expect(unsafeYarn.add).toHaveBeenCalledTimes(0);
  });

  test('it should yarn install packages that are already installed when run from the project root', async () => {
    let cwd = f.copy('nested-workspaces');
    let project = await Project.init(cwd);

    await addDependenciesToPackage(project, project.pkg, [{ name: 'react' }]);

    expect(unsafeYarn.add).toHaveBeenCalledTimes(1);
    expect(unsafeYarn.add).toHaveBeenCalledWith(
      project.pkg,
      [{ name: 'react' }],
      'dependencies'
    );
  });

  test('it should throw if version does not match version in project config', async () => {
    let cwd = f.copy('nested-workspaces');
    let project = await Project.init(cwd);
    let packages = await project.getPackages();
    let pkg = project.getPackageByName(packages, 'foo');
    if (!pkg) throw new Error('missing foo');

    await expect(
      addDependenciesToPackage(project, pkg, [
        { name: 'left-pad', version: '2.0.0' }
      ])
    ).rejects.toBeInstanceOf(Error);
  });

  test('should call symlinkPackageDependencies to symlink dependencies in workspace', async () => {
    let cwd = f.copy('package-with-external-deps-installed');
    let project = await Project.init(cwd);
    let packages = await project.getPackages();
    let pkg = project.getPackageByName(packages, 'foo');
    if (!pkg) throw new Error('missing foo');

    await addDependenciesToPackage(project, pkg, [
      { name: 'project-only-dep' }
    ]);
    let packagesFinal = await project.getPackages();
    let { graph } = await project.getDependencyGraph(packagesFinal);

    expect(symlinkSpy).toHaveBeenCalledWith(project, pkg, ['project-only-dep'], graph);
  });

  test('should update packages dependencies in package config', async () => {
    let cwd = f.copy('package-with-external-deps-installed');
    let project = await Project.init(cwd);
    let packages = await project.getPackages();
    let pkg = project.getPackageByName(packages, 'foo');
    if (!pkg) throw new Error('missing foo');

    expect(pkg.getDependencyVersionRange('project-only-dep')).toEqual(null);
    await addDependenciesToPackage(project, pkg, [
      { name: 'project-only-dep' }
    ]);
    let packagesFinal = await project.getPackages();
    let { graph } = await project.getDependencyGraph(packagesFinal);

    expect(symlinkSpy).toHaveBeenCalledWith(project, pkg, ['project-only-dep'], graph);
    expect(pkg.getDependencyVersionRange('project-only-dep')).toEqual('^1.0.0');
  });

  test('should update all package dependencies when run from project root', async () => {
    let cwd = f.copy('package-with-external-deps-installed');
    let project = await Project.init(cwd);
    let packages = await project.getPackages();
    let fooPkg = project.getPackageByName(packages, 'foo');
    let barPkg = project.getPackageByName(packages, 'bar');
    if (!fooPkg || !barPkg) {
      // This check is required to satisfy flow
      throw new Error('missing packages');
    }

    expect(project.pkg.getDependencyVersionRange('global-dep')).toEqual(
      '^1.0.0'
    );
    expect(fooPkg.getDependencyVersionRange('global-dep')).toEqual('^1.0.0');
    expect(barPkg.getDependencyVersionRange('global-dep')).toEqual('^1.0.0');

    expect(project.pkg.getDependencyVersionRange('foo-dep')).toEqual('^1.0.0');
    expect(fooPkg.getDependencyVersionRange('foo-dep')).toEqual('^1.0.0');
    expect(barPkg.getDependencyVersionRange('foo-dep')).toEqual(null);

    await addDependenciesToPackage(project, project.pkg, [
      { name: 'global-dep', version: '^1.1.0' },
      { name: 'foo-dep', version: 'latest' }
    ]);

    // Refetch packages as their config will be stale
    packages = await project.getPackages();
    fooPkg = project.getPackageByName(packages, 'foo');
    barPkg = project.getPackageByName(packages, 'bar');
    if (!fooPkg || !barPkg) {
      // This check is required to satisfy flow
      throw new Error('missing packages');
    }

    expect(project.pkg.getDependencyVersionRange('global-dep')).toEqual(
      '^1.1.0'
    );
    expect(fooPkg.getDependencyVersionRange('global-dep')).toEqual('^1.1.0');
    expect(barPkg.getDependencyVersionRange('global-dep')).toEqual('^1.1.0');

    // The 'latest' dist tag of foo-dep should resolve to its actual version in root & workspaces
    expect(project.pkg.getDependencyVersionRange('foo-dep')).toEqual('^2.0.0');
    expect(fooPkg.getDependencyVersionRange('foo-dep')).toEqual('^2.0.0');
    expect(barPkg.getDependencyVersionRange('foo-dep')).toEqual(null);
  });

  test('should be able to add packages with tagged versions (without specifying)', async () => {
    let cwd = f.copy('package-with-external-deps-installed');
    let project = await Project.init(cwd);
    let packages = await project.getPackages();
    let pkg = project.getPackageByName(packages, 'foo');
    if (!pkg) throw new Error('missing foo');

    await addDependenciesToPackage(project, pkg, [
      { name: 'project-only-dep-with-beta-tag' }
    ]);

    expect(
      pkg.getDependencyVersionRange('project-only-dep-with-beta-tag')
    ).toEqual('1.0.0-beta');
  });

  describe('when adding internal package', () => {
    test('should set version as current version of internal package if no version passed', async () => {
      // i.e if we have bar 1.0.1 installed locally addDependenciesToPackages should add ^1.0.1
      let cwd = f.copy('nested-workspaces');
      let project = await Project.init(cwd);
      let packages = await project.getPackages();
      let pkg = project.getPackageByName(packages, 'bar');
      if (!pkg) throw new Error('missing bar');

      expect(pkg.getDependencyVersionRange('baz')).toEqual(null);
      await addDependenciesToPackage(project, pkg, [{ name: 'baz' }]);
      let packagesFinal = await project.getPackages();
      let { graph } = await project.getDependencyGraph(packagesFinal);

      expect(symlinkSpy).toHaveBeenCalledWith(project, pkg, ['baz'], graph);
      expect(pkg.getDependencyVersionRange('baz')).toEqual('^1.0.1');
    });

    test('should allow any version range that satisfies local dep', async () => {
      // i.e if we have bar 1.0.1 installed locally ^1.0.0 should still install
      let cwd = f.copy('nested-workspaces');
      let project = await Project.init(cwd);
      let packages = await project.getPackages();
      let pkg = project.getPackageByName(packages, 'bar');

      if (!pkg) throw new Error('missing bar');

      expect(pkg.getDependencyVersionRange('baz')).toEqual(null);
      await addDependenciesToPackage(project, pkg, [
        { name: 'baz', version: '^1.0.0' }
      ]);
      let packagesFinal = await project.getPackages();
      let { graph } = await project.getDependencyGraph(packagesFinal);

      expect(symlinkSpy).toHaveBeenCalledWith(project, pkg, ['baz'], graph);
      expect(pkg.getDependencyVersionRange('baz')).toEqual('^1.0.0');
    });

    test('should throw if attempting to set to version that doesnt satisfy local', async () => {
      let cwd = f.copy('nested-workspaces');
      let project = await Project.init(cwd);
      let packages = await project.getPackages();
      let pkg = project.getPackageByName(packages, 'bar');
      if (!pkg) throw new Error('missing bar');

      // local baz version is 1.0.0, so we'll install ^2.0.0
      await expect(
        addDependenciesToPackage(project, pkg, [
          { name: 'baz', version: '^2.0.0' }
        ])
      ).rejects.toBeInstanceOf(Error);
    });

    test('should not add internal to root package', async () => {
      let cwd = f.copy('nested-workspaces');
      let project = await Project.init(cwd);
      let packages = await project.getPackages();
      let pkg = project.getPackageByName(packages, 'bar');
      if (!pkg) throw new Error('missing bar');

      expect(project.pkg.getDependencyVersionRange('baz')).toEqual(null);
      await addDependenciesToPackage(project, pkg, [{ name: 'baz' }]);
      expect(project.pkg.getDependencyVersionRange('baz')).toEqual(null);
      expect(unsafeYarn.add).toHaveBeenCalledTimes(0);
    });
  });
});
