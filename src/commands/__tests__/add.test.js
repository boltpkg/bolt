// @flow
import { add, toAddOptions } from '../add';
import { copyFixtureIntoTempDir } from 'jest-fixtures';
import * as path from 'path';
import * as processes from '../../utils/processes';
import * as yarn from '../../utils/yarn';
import * as fs from '../../utils/fs';
import Package from '../../Package';
import pathExists from 'path-exists';

jest.mock('../../utils/yarn');
jest.mock('../../utils/logger');

const unsafeProcessses: any & typeof processes = processes;
const unsafeYarn: any & typeof yarn = yarn;

// Helper method to check if a dependency is installed, both in the package.json and on the fs
async function depIsInstalled(workspaceDir: string, depName: string) {
  const pkg = await Package.init(path.join(workspaceDir, 'package.json'));
  const dirExists = await pathExists(
    path.join(workspaceDir, 'node_modules', depName)
  );
  const depInPkgJson = pkg.getDependencyType(depName) !== null;

  return dirExists && depInPkgJson;
}

// a mock yarn add function to update the pakcages's config and also node_modules dir
async function fakeYarnAdd(pkg: Package, dependencies, type = 'dependencies') {
  for (let dep of dependencies) {
    await pkg.setDependencyVersionRange(
      dep.name,
      type,
      dep.version || '^1.0.0'
    );
    await fs.mkdirp(path.join(pkg.nodeModules, dep.name));
  }
}

describe('bolt add', () => {
  let projectDir;
  let fooWorkspaceDir;
  let barWorkspaceDir;

  beforeEach(async () => {
    projectDir = await copyFixtureIntoTempDir(
      __dirname,
      'package-with-external-deps-installed'
    );
    fooWorkspaceDir = path.join(projectDir, 'packages', 'foo');
    barWorkspaceDir = path.join(projectDir, 'packages', 'bar');
    unsafeYarn.add.mockImplementation(fakeYarnAdd);
  });

  describe('from the project pkg', () => {
    test('adding new package', async () => {
      expect(await depIsInstalled(projectDir, 'new-dep')).toEqual(false);
      await add(
        toAddOptions(['new-dep'], {
          cwd: projectDir
        })
      );
      expect(yarn.add).toHaveBeenCalledTimes(1);
      expect(await depIsInstalled(projectDir, 'new-dep')).toEqual(true);
    });

    test('adding existing package', async () => {
      expect(await depIsInstalled(projectDir, 'project-only-dep')).toEqual(
        true
      );
      await add(
        toAddOptions(['project-only-dep'], {
          cwd: projectDir
        })
      );
      expect(yarn.add).toHaveBeenCalledTimes(0);
    });

    test('adding new dev dependency', async () => {
      expect(await depIsInstalled(projectDir, 'new-dep')).toEqual(false);
      await add(
        toAddOptions(['new-dep'], {
          dev: true, // equivalent of passing --dev flag
          cwd: projectDir
        })
      );
      expect(yarn.add).toHaveBeenCalledTimes(1);
      expect(yarn.add).toHaveBeenCalledWith(
        expect.any(Package),
        [{ name: 'new-dep' }],
        'devDependencies'
      );
      expect(await depIsInstalled(projectDir, 'new-dep')).toEqual(true);
    });

    test('adding multiple new dependencies', async () => {
      expect(await depIsInstalled(projectDir, 'new-dep')).toEqual(false);
      expect(await depIsInstalled(projectDir, 'new-dep-2')).toEqual(false);
      await add(
        toAddOptions(['new-dep', 'new-dep-2'], {
          cwd: projectDir
        })
      );
      expect(yarn.add).toHaveBeenCalledTimes(1);
      expect(yarn.add).toHaveBeenCalledWith(
        expect.any(Package),
        [{ name: 'new-dep' }, { name: 'new-dep-2' }],
        'dependencies'
      );
      expect(await depIsInstalled(projectDir, 'new-dep')).toEqual(true);
      expect(await depIsInstalled(projectDir, 'new-dep-2')).toEqual(true);
    });
  });

  describe('from a workspace', () => {
    test('adding new package', async () => {
      expect(await depIsInstalled(projectDir, 'new-dep')).toEqual(false);
      expect(await depIsInstalled(fooWorkspaceDir, 'new-dep')).toEqual(false);
      await add(
        toAddOptions(['new-dep'], {
          cwd: fooWorkspaceDir
        })
      );
      expect(yarn.add).toHaveBeenCalledTimes(1);
      expect(await depIsInstalled(projectDir, 'new-dep')).toEqual(true);
      expect(await depIsInstalled(fooWorkspaceDir, 'new-dep')).toEqual(true);
    });

    test('adding existing package', async () => {
      expect(await depIsInstalled(fooWorkspaceDir, 'project-only-dep')).toEqual(
        false
      );
      await add(
        toAddOptions(['project-only-dep'], {
          cwd: fooWorkspaceDir
        })
      );
      expect(yarn.add).toHaveBeenCalledTimes(0);
      expect(await depIsInstalled(fooWorkspaceDir, 'project-only-dep')).toEqual(
        true
      );
    });

    test('adding new dev dependency', async () => {
      expect(await depIsInstalled(fooWorkspaceDir, 'new-dep')).toEqual(false);
      await add(
        toAddOptions(['new-dep'], {
          dev: true, // equivalent of passing --dev flag
          cwd: fooWorkspaceDir
        })
      );
      expect(yarn.add).toHaveBeenCalledTimes(1);
      expect(yarn.add).toHaveBeenCalledWith(
        expect.any(Package),
        [{ name: 'new-dep' }],
        'devDependencies'
      );
      expect(await depIsInstalled(fooWorkspaceDir, 'new-dep')).toEqual(true);
    });

    test('adding multiple new dependencies', async () => {
      expect(await depIsInstalled(fooWorkspaceDir, 'new-dep')).toEqual(false);
      expect(await depIsInstalled(fooWorkspaceDir, 'new-dep-2')).toEqual(false);
      await add(
        toAddOptions(['new-dep', 'new-dep-2'], {
          cwd: fooWorkspaceDir
        })
      );
      expect(yarn.add).toHaveBeenCalledTimes(1);
      expect(yarn.add).toHaveBeenCalledWith(
        expect.any(Package),
        [{ name: 'new-dep' }, { name: 'new-dep-2' }],
        'dependencies'
      );
      expect(await depIsInstalled(fooWorkspaceDir, 'new-dep')).toEqual(true);
      expect(await depIsInstalled(fooWorkspaceDir, 'new-dep-2')).toEqual(true);
    });
  });
});
