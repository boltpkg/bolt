// @flow
import path from 'path';
import getProject from '../getProject';
import fixtures from 'fixturez';

const f = fixtures(__dirname);

describe('function/getProject', () => {
  describe('A simple project', () => {
    it('should return path to a project root folder from a workspace', async () => {
      let projectRoot = f.find('simple-project');
      let workspacePath = path.join(projectRoot, 'packages', 'bar');
      return getProject({ cwd: workspacePath }).then(pr =>
        expect(pr.dir).toBe(projectRoot)
      );
    });
  });

  describe('A project with nested workspaces', () => {
    it('should return path to a project root folder from a workspace', async () => {
      let projectRoot = f.find('nested-workspaces');
      let workspacePath = path.join(projectRoot, 'packages', 'foo');
      return getProject({ cwd: workspacePath }).then(pr =>
        expect(pr.dir).toBe(projectRoot)
      );
    });

    it('should return path to a project root folder from a nested workspace', async () => {
      let projectRoot = f.find('nested-workspaces');
      let workspacePath = path.join(
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
