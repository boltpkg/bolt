// @flow
import path from 'path';
import Project from '../Project';
import Package from '../Package';
import Workspace from '../Workspace';

import { getFixturePath } from 'jest-fixtures';

describe('Project', () => {
  let project;

  describe('A simple project', async () => {
    beforeEach(async () => {
      const filePath = await getFixturePath(__dirname, 'simple-project');
      project = await Project.init(filePath);
    });

    it('should be able to create a simple project', async () => {
      expect(project).toBeInstanceOf(Project);
      expect(project.pkg).toBeInstanceOf(Package);
    });

    it('should be able to getWorkspaces', async () => {
      const workspaces = await project.getWorkspaces();
      expect(workspaces.length).toEqual(2);
      expect(workspaces[0]).toBeInstanceOf(Workspace);
    });

    it('should be able to runWorkspaceTasks', async () => {
      const workspaces = await project.getWorkspaces();
      const spy = jest.fn(() => Promise.resolve());

      Project.runWorkspaceTasks(workspaces, spy);

      expect(spy).toHaveBeenCalledTimes(2);
      // should be called with our workspace
      expect(spy.mock.calls[0][0]).toBeInstanceOf(Workspace);
    });
  });

  describe('A more complex Project', () => {
    beforeEach(async () => {
      const filePath = await getFixturePath(__dirname, 'nested-workspaces');
      project = await Project.init(filePath);
    });

    it('should be able to getWorkspaces (including nested)', async () => {
      const workspaces = await project.getWorkspaces();
      expect(workspaces.length).toEqual(3);
      expect(workspaces[0]).toBeInstanceOf(Workspace);
    });

    it('should be able to getDependencyGraph', async () => {
      const workspaces = await project.getWorkspaces();
      const deps = await project.getDependencyGraph(workspaces);
      const { valid, graph } = deps;

      expect(valid).toEqual(true);
      expect(graph).toBeInstanceOf(Map);
      expect(graph.size).toBe(4);

      const expectDependencies = (key, len) => {
        const val = graph.get(key);
        expect(val && val.dependencies && val.dependencies.length).toEqual(len);
      };
      expectDependencies('bar', 0);
      expectDependencies('foo', 1);
      expectDependencies('baz', 1);
    });

    it('should be able to getDependentsGraph', async () => {
      const workspaces = await project.getWorkspaces();
      const deps = await project.getDependentsGraph(workspaces);

      const { valid, graph } = deps;
      expect(valid).toEqual(true);
      expect(graph).toBeInstanceOf(Map);
      expect(graph.size).toBe(3);

      const expectDependents = (key, len) => {
        const val = graph.get(key);
        expect(val && val.dependents && val.dependents.length).toEqual(len);
      };
      expectDependents('bar', 2);
      expectDependents('foo', 0);
      expectDependents('baz', 0);
    });
  });
});
