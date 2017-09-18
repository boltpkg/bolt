// @flow
import path from 'path';
import Project from '../Project';
import Package from '../Package';
import Workspace from '../Workspace';

import { getFixturePath } from 'jest-fixtures';

const assertDependencies = (graph, pkg, dependencies) => {
  const val = graph.get(pkg);
  expect(val && val.dependencies).toEqual(dependencies);
};

const assertDependents = (graph, pkg, dependents) => {
  const val = graph.get(pkg);
  expect(val && val.dependents).toEqual(dependents);
};

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

  describe('A project with nested workspaces', () => {
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
      const { valid, graph } = await project.getDependencyGraph(workspaces);
      const expectedDependencies = {
        'fixture-project-nested-workspaces': [],
        foo: ['bar'],
        bar: [],
        baz: ['bar']
      };

      expect(valid).toEqual(true);
      expect(graph).toBeInstanceOf(Map);
      expect(graph.size).toBe(4);

      Object.entries(expectedDependencies).forEach(([pkg, dependencies]) => {
        assertDependencies(graph, pkg, dependencies);
      });
    });

    it('should be able to getDependentsGraph', async () => {
      const workspaces = await project.getWorkspaces();
      const { valid, graph } = await project.getDependentsGraph(workspaces);
      const expectedDependents = {
        bar: ['foo', 'baz'],
        foo: [],
        baz: []
      };

      expect(valid).toEqual(true);
      expect(graph).toBeInstanceOf(Map);
      expect(graph.size).toBe(Object.keys(expectedDependents).length);

      Object.entries(expectedDependents).forEach(([pkg, dependents]) => {
        assertDependents(graph, pkg, dependents);
      });
    });
  });

  describe('A project with nested workspaces and transitive dependents', () => {
    beforeEach(async () => {
      const filePath = await getFixturePath(
        __dirname,
        'nested-workspaces-transitive-dependents'
      );
      project = await Project.init(filePath);
    });

    it('should be able to getWorkspaces (including nested)', async () => {
      const workspaces = await project.getWorkspaces();
      expect(workspaces.length).toEqual(4);
      expect(workspaces[0]).toBeInstanceOf(Workspace);
    });

    it('should be able to getDependencyGraph', async () => {
      const workspaces = await project.getWorkspaces();
      const { valid, graph } = await project.getDependencyGraph(workspaces);
      const expectedDependencies = {
        'nested-workspaces-transitive-dependents': [],
        'pkg-a': [],
        'workspace-a': ['pkg-a'],
        'pkg-b': ['pkg-a'],
        'pkg-c': ['pkg-b']
      };

      expect(valid).toEqual(true);
      expect(graph).toBeInstanceOf(Map);
      expect(graph.size).toBe(Object.keys(expectedDependencies).length);

      const assertDependencies = (pkg, deps) => {
        const val = graph.get(pkg);
        expect(val && val.dependencies).toEqual(deps);
      };

      Object.entries(expectedDependencies).forEach(([pkg, dependencies]) => {
        assertDependencies(pkg, dependencies);
      });
    });

    it('should be able to getDependentsGraph', async () => {
      const workspaces = await project.getWorkspaces();
      const { valid, graph } = await project.getDependentsGraph(workspaces);
      const expectedDependents = {
        'pkg-a': ['workspace-a', 'pkg-b'],
        'workspace-a': [],
        'pkg-b': ['pkg-c'],
        'pkg-c': []
      };

      expect(valid).toEqual(true);
      expect(graph).toBeInstanceOf(Map);
      expect(graph.size).toBe(Object.keys(expectedDependents).length);

      Object.entries(expectedDependents).forEach(([pkg, dependents]) => {
        assertDependents(graph, pkg, dependents);
      });
    });
  });
});
