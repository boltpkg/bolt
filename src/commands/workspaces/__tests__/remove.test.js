// @flow
import { workspacesRemove } from '../remove';
import * as fs from 'fs';
import * as path from 'path';
import * as yarn from '../../../utils/yarn';
import pathExists from 'path-exists';
import fixtures from 'fixturez';

const f = fixtures(__dirname);

jest.mock('../../../utils/logger');
jest.mock('../../../utils/yarn');

describe('bolt workspaces remove', () => {
  test('removing a dependency from all workspaces', async () => {
    let tempDir = f.copy('package-with-external-deps-installed');
    let fooWorkspaceDir = path.join(tempDir, 'packages', 'foo');
    let barWorkspaceDir = path.join(tempDir, 'packages', 'bar');

    await workspacesRemove({ cwd: tempDir }, ['global-dep']);

    expect(yarn.remove).toHaveBeenCalledTimes(0);
    expect(
      await pathExists(path.join(fooWorkspaceDir, 'node_modules', 'global-dep'))
    ).toBe(false);
    expect(
      await pathExists(path.join(barWorkspaceDir, 'node_modules', 'global-dep'))
    ).toBe(false);
    expect(
      await pathExists(path.join(tempDir, 'node_modules', 'global-dep'))
    ).toBe(true);
    expect(
      fs.readFileSync(path.join(fooWorkspaceDir, 'package.json'), 'utf-8')
    ).not.toContain('global-dep');
    expect(
      fs.readFileSync(path.join(barWorkspaceDir, 'package.json'), 'utf-8')
    ).not.toContain('global-dep');
  });

  test('removing a dependency that only exists in some of the workspaces', async () => {
    let tempDir = f.copy('package-with-external-deps-installed');
    let workspaceDir = path.join(tempDir, 'packages', 'foo');

    await workspacesRemove({ cwd: tempDir }, ['foo-dep']);

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

  test('removing a dependency that doesnt exist in any of the workspaces', async () => {
    let tempDir = f.copy('package-with-external-deps-installed');

    await expect(
      workspacesRemove({ cwd: tempDir }, ['package-only-dep'])
    ).rejects.toBeInstanceOf(Error);
  });

  test('removing a dependency that doesnt exist in any of the filtered workspaces', async () => {
    let tempDir = f.copy('package-with-external-deps-installed');

    await expect(
      workspacesRemove({ cwd: tempDir, ignore: 'foo' }, ['foo-dep'])
    ).rejects.toBeInstanceOf(Error);
  });
});
