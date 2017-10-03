// @flow
import path from 'path';
import getProject from '../getProject';

import { getFixturePath } from 'jest-fixtures';

describe('function/getProject', () => {
  describe('A simple project', () => {
    it('should return path to a project root folder from a workspace', async () => {
      const projectRoot = await getFixturePath(__dirname, 'simple-project');
      const workspacePath = path.join(projectRoot, 'packages', 'bar');
      return getProject({ cwd: workspacePath }).then(pr =>
        expect(pr.dir).toBe(projectRoot)
      );
    });
  });

  describe('A project with nested workspaces', () => {
    it('should return path to a project root folder from a workspace', async () => {
      const projectRoot = await getFixturePath(__dirname, 'nested-workspaces');
      const workspacePath = path.join(projectRoot, 'packages', 'foo');
      return getProject({ cwd: workspacePath }).then(pr =>
        expect(pr.dir).toBe(projectRoot)
      );
    });

    it('should return path to a project root folder from a nested workspace', async () => {
      const projectRoot = await getFixturePath(__dirname, 'nested-workspaces');
      const workspacePath = path.join(
        projectRoot,
        'packages',
        'foo',
        'packages',
        'baz'
      );
      return getProject({ cwd: workspacePath }).then(pr =>
        expect(pr.dir).toBe(projectRoot)
      );
    });
  });
});
