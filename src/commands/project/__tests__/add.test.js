// @flow
import { projectAdd } from '../add';
import * as fs from 'fs';
import * as path from 'path';
import * as yarn from '../../../utils/yarn';
import fixtures from 'fixturez';
import addDependenciesToPackage from '../../../utils/addDependenciesToPackages';

const f = fixtures(__dirname);

jest.mock('../../../utils/addDependenciesToPackages');

describe('bolt project add', () => {
  test('adding a project dependency only used by the project', async () => {
    let tempDir = f.copy('package-with-external-deps-installed');

    await projectAdd({
      flags: { cwd: tempDir },
      subCommandArgs: ['project-new-dep']
    });

    expect(addDependenciesToPackage).toHaveBeenCalledTimes(1);
  });
});
