// @flow
import { add } from '../add';
import * as path from 'path';
import * as processes from '../../utils/processes';
import * as yarn from '../../utils/yarn';
import * as fs from '../../utils/fs';
import Package from '../../Package';
import pathExists from 'path-exists';
import fixtures from 'fixturez';

const f = fixtures(__dirname);

jest.mock('../../utils/yarn');
jest.mock('../../utils/logger');

const unsafeProcessses: any & typeof processes = processes;
const unsafeYarn: any & typeof yarn = yarn;

// Helper method to check if a dependency is installed, both in the package.json and on the fs
async function depIsInstalled(
  workspaceDir: string,
  depName: string,
  version?: string
) {
  const pkg = await Package.init(path.join(workspaceDir, 'package.json'));
  const dirExists = await pathExists(
    path.join(workspaceDir, 'node_modules', depName)
  );
  const depInPkgJson = pkg.getDependencyTypes(depName).length > 0;
  const correctVersion =
    !version || pkg.getDependencyVersionRange(depName) === version;

  return dirExists && depInPkgJson && correctVersion;
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
    projectDir = f.copy('package-with-external-deps-installed');
    fooWorkspaceDir = path.join(projectDir, 'packages', 'foo');
    barWorkspaceDir = path.join(projectDir, 'packages', 'bar');
    unsafeYarn.add.mockImplementation(fakeYarnAdd);
  });

  describe('from the project pkg', () => {
    test('adding new package', async () => {
      expect(await depIsInstalled(projectDir, 'new-dep')).toEqual(false);
      await add({
        commandArgs: ['new-dep'],
        flags: {
          cwd: projectDir
        }
      });
      expect(yarn.add).toHaveBeenCalledTimes(1);
      expect(await depIsInstalled(projectDir, 'new-dep')).toEqual(true);
    });

    test('adding existing package', async () => {
      expect(await depIsInstalled(projectDir, 'project-only-dep')).toEqual(
        true
      );
      await add({
        commandArgs: ['project-only-dep'],
        flags: {
          cwd: projectDir
        }
      });
      expect(yarn.add).toHaveBeenCalledTimes(0);
    });

    test('adding new dependency with --dev flag', async () => {
      expect(await depIsInstalled(projectDir, 'new-dep')).toEqual(false);
      await add({
        commandArgs: ['new-dep'],
        flags: {
          dev: true, // equivalent of passing --dev flag
          cwd: projectDir
        }
      });
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
      await add({
        commandArgs: ['new-dep', 'new-dep-2'],
        flags: {
          cwd: projectDir
        }
      });
      expect(yarn.add).toHaveBeenCalledTimes(1);
      expect(yarn.add).toHaveBeenCalledWith(
        expect.any(Package),
        [{ name: 'new-dep' }, { name: 'new-dep-2' }],
        'dependencies'
      );
      expect(await depIsInstalled(projectDir, 'new-dep')).toEqual(true);
      expect(await depIsInstalled(projectDir, 'new-dep-2')).toEqual(true);
    });

    test('adding internal dep (should error)', async () => {
      await expect(
        add({
          commandArgs: ['bar'],
          flags: {
            cwd: projectDir
          }
        })
      ).rejects.toBeInstanceOf(Error);

      expect(yarn.add).toHaveBeenCalledTimes(0);
      expect(await depIsInstalled(projectDir, 'bar')).toEqual(false);
    });

    test('adding new package at version', async () => {
      expect(await depIsInstalled(projectDir, 'new-dep')).toEqual(false);
      await add({
        commandArgs: ['new-dep@^2.0.0'],
        flags: {
          cwd: projectDir
        }
      });
      expect(yarn.add).toHaveBeenCalledTimes(1);
      expect(await depIsInstalled(projectDir, 'new-dep', '^2.0.0')).toEqual(
        true
      );
    });

    test('adding scoped package', async () => {
      expect(await depIsInstalled(projectDir, '@scope/pkgName')).toEqual(false);
      await add({
        commandArgs: ['@scope/pkgName'],
        flags: {
          cwd: projectDir
        }
      });
      expect(yarn.add).toHaveBeenCalledTimes(1);
      expect(await depIsInstalled(projectDir, '@scope/pkgName')).toEqual(true);
    });

    test('adding scoped package at a version', async () => {
      expect(await depIsInstalled(projectDir, '@scope/pkgName@^2.0.0')).toEqual(
        false
      );
      await add({
        commandArgs: ['@scope/pkgName@^2.0.0'],
        flags: {
          cwd: projectDir
        }
      });
      expect(yarn.add).toHaveBeenCalledTimes(1);
      expect(
        await depIsInstalled(projectDir, '@scope/pkgName', '^2.0.0')
      ).toEqual(true);
    });
  });

  describe('from a workspace', () => {
    test('adding new package', async () => {
      expect(await depIsInstalled(projectDir, 'new-dep')).toEqual(false);
      expect(await depIsInstalled(fooWorkspaceDir, 'new-dep')).toEqual(false);
      await add({
        flags: {
          cwd: fooWorkspaceDir
        },
        commandArgs: ['new-dep']
      });
      expect(yarn.add).toHaveBeenCalledTimes(1);
      expect(await depIsInstalled(projectDir, 'new-dep')).toEqual(true);
      expect(await depIsInstalled(fooWorkspaceDir, 'new-dep')).toEqual(true);
    });

    test('adding existing package', async () => {
      expect(await depIsInstalled(fooWorkspaceDir, 'project-only-dep')).toEqual(
        false
      );
      await add({
        flags: {
          cwd: fooWorkspaceDir
        },
        commandArgs: ['project-only-dep']
      });
      expect(yarn.add).toHaveBeenCalledTimes(0);
      expect(await depIsInstalled(fooWorkspaceDir, 'project-only-dep')).toEqual(
        true
      );
    });

    test('adding new dependency with --dev flag', async () => {
      expect(await depIsInstalled(fooWorkspaceDir, 'new-dep')).toEqual(false);
      await add({
        flags: {
          dev: true, // equivalent of passing --dev flag
          cwd: fooWorkspaceDir
        },
        commandArgs: ['new-dep']
      });
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
      await add({
        flags: {
          cwd: fooWorkspaceDir
        },
        commandArgs: ['new-dep', 'new-dep-2']
      });
      expect(yarn.add).toHaveBeenCalledTimes(1);
      expect(yarn.add).toHaveBeenCalledWith(
        expect.any(Package),
        [{ name: 'new-dep' }, { name: 'new-dep-2' }],
        'dependencies'
      );
      expect(await depIsInstalled(fooWorkspaceDir, 'new-dep')).toEqual(true);
      expect(await depIsInstalled(fooWorkspaceDir, 'new-dep-2')).toEqual(true);
    });

    test('adding internal dep', async () => {
      expect(await depIsInstalled(fooWorkspaceDir, 'bar')).toEqual(false);

      await add({
        flags: {
          cwd: fooWorkspaceDir
        },
        commandArgs: ['bar']
      });

      expect(yarn.add).toHaveBeenCalledTimes(0);
      expect(await depIsInstalled(fooWorkspaceDir, 'bar')).toEqual(true);
    });

    test('adding new package at version', async () => {
      expect(await depIsInstalled(fooWorkspaceDir, 'new-dep')).toEqual(false);
      await add({
        flags: {
          cwd: fooWorkspaceDir
        },
        commandArgs: ['new-dep@^2.0.0']
      });
      expect(yarn.add).toHaveBeenCalledTimes(1);
      expect(
        await depIsInstalled(fooWorkspaceDir, 'new-dep', '^2.0.0')
      ).toEqual(true);
    });

    test('adding scoped package', async () => {
      expect(await depIsInstalled(fooWorkspaceDir, '@scope/pkgName')).toEqual(
        false
      );
      await add({
        flags: {
          cwd: fooWorkspaceDir
        },
        commandArgs: ['@scope/pkgName']
      });
      expect(yarn.add).toHaveBeenCalledTimes(1);
      expect(await depIsInstalled(fooWorkspaceDir, '@scope/pkgName')).toEqual(
        true
      );
    });

    test('adding scoped package at a version', async () => {
      expect(
        await depIsInstalled(fooWorkspaceDir, '@scope/pkgName@^2.0.0')
      ).toEqual(false);
      await add({
        flags: {
          cwd: fooWorkspaceDir
        },
        commandArgs: ['@scope/pkgName@^2.0.0']
      });
      expect(yarn.add).toHaveBeenCalledTimes(1);
      expect(
        await depIsInstalled(fooWorkspaceDir, '@scope/pkgName', '^2.0.0')
      ).toEqual(true);
    });
  });
});
