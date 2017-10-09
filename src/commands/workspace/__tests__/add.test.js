// @flow
import { workspaceAdd, toWorkspaceAddOptions } from '../add';
import { copyFixtureIntoTempDir } from 'jest-fixtures';
import * as path from 'path';
import * as processes from '../../../utils/processes';
import * as yarn from '../../../utils/yarn';
import * as fs from '../../../utils/fs';
import Package from '../../../Package';
import pathExists from 'path-exists';

jest.mock('../../../utils/yarn');
jest.mock('../../../utils/logger');

const unsafeProcessses: any & typeof processes = processes;
const unsafeYarn: any & typeof yarn = yarn;

async function depIsInstalled(workspaceDir: string, depName: string) {
  const pkg = await Package.init(path.join(workspaceDir, 'package.json'));
  const dirExists = await pathExists(
    path.join(workspaceDir, 'node_modules', depName)
  );
  const depInPkgJson = pkg.getDependencyType(depName) !== null;

  return dirExists && depInPkgJson;
}

describe('bolt workspace add', () => {
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
  });

  test('running from project, installing dependency that is in project', async () => {
    expect(await depIsInstalled(fooWorkspaceDir, 'project-only-dep')).toEqual(
      false
    );
    await workspaceAdd(
      toWorkspaceAddOptions(['foo', 'project-only-dep'], {
        cwd: projectDir
      })
    );
    expect(yarn.add).toHaveBeenCalledTimes(0);
    expect(await depIsInstalled(fooWorkspaceDir, 'project-only-dep')).toEqual(
      true
    );
  });

  test('running from a different workspace, installing dependency that is in project', async () => {
    expect(await depIsInstalled(fooWorkspaceDir, 'project-only-dep')).toEqual(
      false
    );
    await workspaceAdd(
      toWorkspaceAddOptions(['foo', 'project-only-dep'], {
        cwd: barWorkspaceDir
      })
    );
    expect(yarn.add).toHaveBeenCalledTimes(0);
    expect(await depIsInstalled(fooWorkspaceDir, 'project-only-dep')).toEqual(
      true
    );
  });

  test('running from project, installing dep not in project', async () => {
    // yarn add is mocked, so we need to update the package json and create a dir in node_modules
    // ourselves (the tasks `yarn add` would normally do)
    unsafeYarn.add.mockImplementationOnce(async (pkg: Package) => {
      await pkg.setDependencyVersionRange('new-dep', 'dependencies', '^1.0.0');
      await fs.mkdirp(path.join(pkg.nodeModules, 'new-dep'));
    });
    expect(await depIsInstalled(fooWorkspaceDir, 'new-dep')).toEqual(false);
    await workspaceAdd(
      toWorkspaceAddOptions(['foo', 'new-dep'], {
        cwd: projectDir
      })
    );
    expect(yarn.add).toHaveBeenCalledTimes(1);
    expect(await depIsInstalled(fooWorkspaceDir, 'new-dep')).toEqual(true);
  });

  test('running from a different workspace, installing dep not in project', async () => {
    // yarn add is mocked, so we need to update the package json and create a dir in node_modules
    // ourselves (the tasks `yarn add` would normally do)
    unsafeYarn.add.mockImplementationOnce(async (pkg: Package) => {
      await pkg.setDependencyVersionRange('new-dep', 'dependencies', '^1.0.0');
      await fs.mkdirp(path.join(pkg.nodeModules, 'new-dep'));
    });
    expect(await depIsInstalled(fooWorkspaceDir, 'new-dep')).toEqual(false);
    await workspaceAdd(
      toWorkspaceAddOptions(['foo', 'new-dep'], {
        cwd: barWorkspaceDir
      })
    );
    expect(yarn.add).toHaveBeenCalledTimes(1);
    expect(await depIsInstalled(fooWorkspaceDir, 'new-dep')).toEqual(true);
  });
});
