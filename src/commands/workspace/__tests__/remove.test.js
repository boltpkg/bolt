// @flow
import { workspaceRemove, toWorkspaceRemoveOptions } from '../remove';
import * as fs from 'fs';
import * as path from 'path';
import * as yarn from '../../../utils/yarn';
import pathExists from 'path-exists';
import fixtures from 'fixturez';

const f = fixtures(__dirname);

jest.mock('../../../utils/logger');
jest.mock('../../../utils/yarn');

describe('bolt workspace remove', () => {
  test('removing a workspace dependency that exists', async () => {
    let tempDir = f.copy('package-with-external-deps-installed');
    let workspaceDir = path.join(tempDir, 'packages', 'foo');

    await workspaceRemove(
      toWorkspaceRemoveOptions(['foo', 'foo-dep'], { cwd: tempDir })
    );

    expect(yarn.remove).toHaveBeenCalledTimes(0);
    expect(
      await pathExists(path.join(workspaceDir, 'node_modules', 'foo-dep'))
    ).toBe(false);
    expect(
      await pathExists(path.join(tempDir, 'node_modules', 'foo-dep'))
    ).toBe(true);
    expect(
      fs.readFileSync(path.join(workspaceDir, 'package.json'), 'utf-8')
    ).not.toContain('foo-dep');
  });

  test('removing a workspace dependency that doesnt exist in that package', async () => {
    let tempDir = f.copy('package-with-external-deps-installed');

    await expect(
      workspaceRemove(
        toWorkspaceRemoveOptions(['bar', 'foo-dep'], { cwd: tempDir })
      )
    ).rejects.toBeInstanceOf(Error);
  });

  test('removing a workspace dependency from inside another directory', async () => {
    let tempDir = f.copy('package-with-external-deps-installed');

    let fooWorkspaceDir = path.join(tempDir, 'packages', 'foo');
    let barWorkspaceDir = path.join(tempDir, 'packages', 'bar');

    await workspaceRemove(
      toWorkspaceRemoveOptions(['foo', 'foo-dep'], { cwd: barWorkspaceDir })
    );

    expect(yarn.remove).toHaveBeenCalledTimes(0);
    expect(
      await pathExists(path.join(fooWorkspaceDir, 'node_modules', 'foo-dep'))
    ).toBe(false);
    expect(
      await pathExists(path.join(tempDir, 'node_modules', 'foo-dep'))
    ).toBe(true);
    expect(
      fs.readFileSync(path.join(fooWorkspaceDir, 'package.json'), 'utf-8')
    ).not.toContain('foo-dep');
  });
});
