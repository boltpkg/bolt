// @flow
import { workspaceAdd } from '../add';
import * as path from 'path';
import * as processes from '../../../utils/processes';
import * as yarn from '../../../utils/yarn';
import * as fs from '../../../utils/fs';
import Package from '../../../Package';
import pathExists from 'path-exists';
import fixtures from 'fixturez';

const f = fixtures(__dirname);

jest.mock('../../../utils/yarn');
jest.mock('../../../utils/logger');

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

describe('bolt workspace add', () => {
  let projectDir;
  let fooWorkspaceDir;
  let barWorkspaceDir;

  beforeEach(async () => {
    projectDir = f.copy('package-with-external-deps-installed');
    fooWorkspaceDir = path.join(projectDir, 'packages', 'foo');
    barWorkspaceDir = path.join(projectDir, 'packages', 'bar');
    unsafeYarn.add.mockImplementation(fakeYarnAdd);
  });

  describe('running from a project', () => {
    test('installing dependency that is in project', async () => {
      expect(await depIsInstalled(fooWorkspaceDir, 'project-only-dep')).toEqual(
        false
      );
      await workspaceAdd(
        {
          cwd: projectDir
        },
        ['foo', 'project-only-dep']
      );
      expect(yarn.add).toHaveBeenCalledTimes(0);
      expect(await depIsInstalled(fooWorkspaceDir, 'project-only-dep')).toEqual(
        true
      );
    });

    test('installing a dependency not in project', async () => {
      expect(await depIsInstalled(fooWorkspaceDir, 'new-dep')).toEqual(false);
      await workspaceAdd(
        {
          cwd: projectDir
        },
        ['foo', 'new-dep']
      );
      expect(yarn.add).toHaveBeenCalledTimes(1);
      expect(await depIsInstalled(fooWorkspaceDir, 'new-dep')).toEqual(true);
    });

    test('installing a scoped dependency', async () => {
      expect(await depIsInstalled(fooWorkspaceDir, '@scope/pkgName')).toEqual(
        false
      );
      await workspaceAdd(
        {
          cwd: projectDir
        },
        ['foo', '@scope/pkgName']
      );
      expect(yarn.add).toHaveBeenCalledTimes(1);
      expect(await depIsInstalled(fooWorkspaceDir, '@scope/pkgName')).toEqual(
        true
      );
    });

    test('installing a scoped dependency at a version', async () => {
      expect(
        await depIsInstalled(fooWorkspaceDir, '@scope/pkgName@^2.0.0')
      ).toEqual(false);
      await workspaceAdd(
        {
          cwd: projectDir
        },
        ['foo', '@scope/pkgName@^2.0.0']
      );
      expect(yarn.add).toHaveBeenCalledTimes(1);
      expect(
        await depIsInstalled(fooWorkspaceDir, '@scope/pkgName', '^2.0.0')
      ).toEqual(true);
    });
  });

  describe('running from a workspace', () => {
    test('running from a different workspace, installing dependency that is in project', async () => {
      expect(await depIsInstalled(fooWorkspaceDir, 'project-only-dep')).toEqual(
        false
      );
      await workspaceAdd(
        {
          cwd: barWorkspaceDir
        },
        ['foo', 'project-only-dep']
      );
      expect(yarn.add).toHaveBeenCalledTimes(0);
      expect(await depIsInstalled(fooWorkspaceDir, 'project-only-dep')).toEqual(
        true
      );
    });

    test('running from a different workspace, installing dep not in project', async () => {
      expect(await depIsInstalled(fooWorkspaceDir, 'new-dep')).toEqual(false);
      await workspaceAdd(
        {
          cwd: barWorkspaceDir
        },
        ['foo', 'new-dep']
      );
      expect(yarn.add).toHaveBeenCalledTimes(1);
      expect(await depIsInstalled(fooWorkspaceDir, 'new-dep')).toEqual(true);
    });

    test('installing a scoped dependency', async () => {
      expect(await depIsInstalled(fooWorkspaceDir, '@scope/pkgName')).toEqual(
        false
      );
      await workspaceAdd(
        {
          cwd: barWorkspaceDir
        },
        ['foo', '@scope/pkgName']
      );
      expect(yarn.add).toHaveBeenCalledTimes(1);
      expect(await depIsInstalled(fooWorkspaceDir, '@scope/pkgName')).toEqual(
        true
      );
    });

    test('installing a scoped dependency at a version', async () => {
      expect(
        await depIsInstalled(fooWorkspaceDir, '@scope/pkgName@^2.0.0')
      ).toEqual(false);
      await workspaceAdd(
        {
          cwd: barWorkspaceDir
        },
        ['foo', '@scope/pkgName@^2.0.0']
      );
      expect(yarn.add).toHaveBeenCalledTimes(1);
      expect(
        await depIsInstalled(fooWorkspaceDir, '@scope/pkgName', '^2.0.0')
      ).toEqual(true);
    });
  });
});
