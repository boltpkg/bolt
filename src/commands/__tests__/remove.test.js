// @flow
import { remove, toRemoveOptions } from '../remove';
import * as fs from 'fs';
import * as path from 'path';
import * as yarn from '../../utils/yarn';
import pathExists from 'path-exists';
import fixtures from 'fixturez';

const f = fixtures(__dirname);

jest.mock('../../utils/logger');
jest.mock('../../utils/yarn');

describe('bolt remove', () => {
  test('removing a project dependency only used by the project', async () => {
    let tempDir = f.copy('package-with-external-deps-installed');

    await remove(toRemoveOptions(['project-only-dep'], { cwd: tempDir }));

    expect(yarn.remove).toHaveBeenCalledTimes(1);
    expect(yarn.remove).toHaveBeenCalledWith(['project-only-dep'], tempDir);
  });

  test('removing a workspace dependency', async () => {
    let tempDir = f.copy('package-with-external-deps-installed');
    let workspaceDir = path.join(tempDir, 'packages', 'foo');

    await remove(toRemoveOptions(['foo-dep'], { cwd: workspaceDir }));

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

  test('removing a dependency that does not exist', async () => {
    let tempDir = f.copy('package-with-external-deps-installed');

    await expect(
      remove(toRemoveOptions(['nonexistent-dep'], { cwd: tempDir }))
    ).rejects.toBeInstanceOf(Error);
  });

  test('removing a dependency that is used by a workspace', async () => {
    let tempDir = f.copy('package-with-external-deps-installed');

    await expect(
      remove(toRemoveOptions(['global-dep'], { cwd: tempDir }))
    ).rejects.toBeInstanceOf(Error);

    expect(
      await pathExists(path.join(tempDir, 'node_modules', 'global-dep'))
    ).toBe(true);
  });
});
