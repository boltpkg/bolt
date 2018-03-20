// @flow
import { upgrade, toUpgradeOptions } from '../upgrade';
import fixtures from 'fixturez';
import * as path from 'path';
import * as processes from '../../utils/processes';
import * as yarn from '../../utils/yarn';
import * as fs from '../../utils/fs';
import Package from '../../Package';
import pathExists from 'path-exists';
import readPkg from 'read-pkg';

jest.mock('../../utils/yarn');
jest.mock('../../utils/logger');

const f = fixtures(__dirname);

const unsafeProcessses: any & typeof processes = processes;
const unsafeYarn: any & typeof yarn = yarn;

async function getDependencyVersion(workspaceDir: string, depName: string) {
  let pkg = await Package.init(path.join(workspaceDir, 'package.json'));
  let dirExists = await pathExists(
    path.join(workspaceDir, 'node_modules', depName)
  );

  if (!dirExists) {
    return '1.0.0';
  }

  let packageJson = await readPkg(
    path.join(workspaceDir, 'node_modules', depName)
  );

  return packageJson && packageJson.version;
}

async function fakeYarnUpgrade(pkg: Package, dependencies) {
  for (let dep of dependencies) {
    let version = await getDependencyVersion(pkg.dir, dep.name);
    let [major, minor, patch] = version.split('.');
    let patchUpgradedVersion = [major, '1', patch].join('.');

    // Only dealing with version so no need to extend package json.
    await fs.writeFile(
      path.join(pkg.nodeModules, dep.name, 'package.json'),
      JSON.stringify({ version: patchUpgradedVersion })
    );
  }
}

describe('bolt upgrade', () => {
  let projectDir;
  let fooWorkspaceDir;
  let barWorkspaceDir;
  beforeEach(async () => {
    projectDir = f.copy('package-with-external-deps-installed');
    fooWorkspaceDir = path.join(projectDir, 'packages', 'foo');
    barWorkspaceDir = path.join(projectDir, 'packages', 'bar');
    unsafeYarn.upgrade.mockImplementation(fakeYarnUpgrade);
  });

  it('should upgrade the dependency for single package', async () => {
    let currentVersion = await getDependencyVersion(projectDir, 'foo-dep');
    expect(currentVersion).toEqual('1.0.0');
    await upgrade(
      toUpgradeOptions(['foo-dep'], {
        cwd: projectDir
      })
    );
    expect(yarn.upgrade).toHaveBeenCalled();
    expect(await getDependencyVersion(projectDir, 'foo-dep')).toEqual('1.1.0');
  });

  it('should upgrade the dependency for multiple package', async () => {
    let currentVersionFooDep = await getDependencyVersion(
      projectDir,
      'foo-dep'
    );
    let currentVersionGlobalDep = await getDependencyVersion(
      projectDir,
      'global-dep'
    );
    expect(currentVersionFooDep).toEqual('1.0.0');
    expect(currentVersionGlobalDep).toEqual('1.0.0');
    await upgrade(
      toUpgradeOptions(['foo-dep', 'global-dep'], {
        cwd: projectDir
      })
    );
    expect(yarn.upgrade).toHaveBeenCalled();
    expect(await getDependencyVersion(projectDir, 'foo-dep')).toEqual('1.1.0');
    expect(await getDependencyVersion(projectDir, 'global-dep')).toEqual(
      '1.1.0'
    );
  });

  it('should not upgrade an internal package', async () => {
    await expect(
      upgrade(toUpgradeOptions(['bar'], { cwd: projectDir }))
    ).rejects.toBeInstanceOf(Error);
  });
});
