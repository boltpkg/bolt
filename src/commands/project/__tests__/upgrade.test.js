// @flow
import * as fs from 'fs';
import * as path from 'path';
import fixtures from 'fixturez';
import { projectUpgrade, toProjectUpgradeOptions } from '../upgrade';
import upgradeDependenciesInPackage from '../../../utils/upgradeDependenciesInPackages';

const f = fixtures(__dirname);

jest.mock('../../../utils/upgradeDependenciesInPackages');

describe('bolt project add', () => {
  test('upgrading a project dependency only used by the project', async () => {
    let tempDir = f.copy('package-with-external-deps-installed');

    await projectUpgrade(
      toProjectUpgradeOptions(['project-new-dep'], { cwd: tempDir })
    );

    expect(upgradeDependenciesInPackage).toHaveBeenCalledTimes(1);
  });
});
