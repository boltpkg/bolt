// @flow

import { copyFixtureIntoTempDir } from 'jest-fixtures';
import path from 'path';

import upgradeDependenciesInPackage from '../upgradeDependenciesInPackages';
import * as fs from '../../utils/fs';
import * as yarn from '../yarn';
import type { DependencySet, Dependency } from '../../types';
import Project from '../../Project';
import Package from '../../Package';
import Config from '../../Config';

jest.mock('../yarn');
// jest.mock('../logger');

const unsafeYarn: any & typeof yarn = yarn;

async function fakeYarnUpgrade(pkg: Package, dependencies: Array<Dependency>) {
  for (let dep of dependencies) {
    await pkg.setDependencyVersionRange(
      dep.name,
      'dependencies',
      dep.version || '^2.0.0'
    );
  }
}

async function depsAtVersion(pkgPath: string, expectedDeps: DependencySet) {
  let allDepsCorrect = true;
  const pkg = await Package.init(path.join(pkgPath, 'package.json'));
  const deps = pkg.getAllDependencies();
  Object.entries(expectedDeps).forEach(([name, version]) => {
    allDepsCorrect = allDepsCorrect && deps.get(name) === version;
  });
  console.log(deps);
  return allDepsCorrect;
}

function getFooDir(project: Project) {
  return path.join(project.pkg.dir, 'packages', 'foo');
}

describe('utils/upgradeDependenciesInPackage', () => {
  beforeEach(() => {
    unsafeYarn.upgrade.mockImplementation(fakeYarnUpgrade);
  });

  test('upgrading existing dep in project', async () => {
    const cwd = await copyFixtureIntoTempDir(__dirname, 'nested-workspaces');
    const project = await Project.init(cwd);

    await upgradeDependenciesInPackage(project, project.pkg, [
      { name: 'left-pad' }
    ]);

    const deps = (await Project.init(cwd)).pkg.getAllDependencies;
    expect(await depsAtVersion(project.pkg.dir, { 'left-pad': '^2.0.0' })).toBe(
      true
    );
  });

  test.only('upgrading shared existing dep in project', async () => {
    const cwd = await copyFixtureIntoTempDir(__dirname, 'nested-workspaces');
    const project = await Project.init(cwd);

    await upgradeDependenciesInPackage(project, project.pkg, [
      { name: 'react', version: '^26.0.0' }
    ]);

    const deps = (await Project.init(cwd)).pkg.getAllDependencies;
    const fooDir = getFooDir(project);
    // expect(await depsAtVersion(project.pkg.dir, { react: '^26.0.0' })).toBe(
    //   true
    // );
    expect(await depsAtVersion(fooDir, { react: '^26.0.0' })).toBe(true);
  });
});
