import * as path from 'path';
import { getFixturePath } from 'jest-fixtures';

import filterWorkspaces from '../filterWorkspaces';
import Project from '../../Project';

/** Checks that a filtered set of workspaces contains all the package names in  expectedWorkspaceNames*/
function workspacesContains(workspaces, expectedWorkspaceNames) {
  return expectedWorkspaceNames.every(name => workspaces.some(ws => ws.pkg.config.name === name));
}

describe('filtering flags', async () => {
  let allWorkspaces;

  beforeEach(async () => {
    const fixturePath = await getFixturePath(__dirname, 'simple-project-nested-workspace-no-deps');
    const project = await Project.init(fixturePath);
    allWorkspaces = await project.getWorkspaces();
  });



  it('should return all workspaces if no filters passed', () => {
    const filteredWorkspaces = filterWorkspaces(allWorkspaces);
    expect(filteredWorkspaces).toEqual(allWorkspaces)
  });

  describe('filtering by name', () => {
    it('should filter to only names that match --only flag', () => {
      const filteredWorkspaces = filterWorkspaces(allWorkspaces, { only: 'foo' });
      expect(filteredWorkspaces.length).toEqual(1);
      expect(workspacesContains(filteredWorkspaces, ['foo'])).toEqual(true);
    });

    it('should remove names that match --ignore flag', () => {
      const filteredWorkspaces = filterWorkspaces(allWorkspaces, { ignore: '@scope/bar' });
      expect(filteredWorkspaces.length).toEqual(2);
      expect(workspacesContains(filteredWorkspaces, ['foo', 'baz'])).toEqual(true);
    });

    it('should support scoped packages (sanity check)', () => {
      const filteredWorkspaces = filterWorkspaces(allWorkspaces, { only: '**/ba*' });
      expect(filteredWorkspaces.length).toEqual(2);
      expect(workspacesContains(filteredWorkspaces, ['@scope/bar', 'baz'])).toEqual(true);
    })

    it('should using both --only and --ignore', () => {
      const filteredWorkspaces = filterWorkspaces(allWorkspaces, { only: '**/ba*', ignore: 'baz' });
      expect(filteredWorkspaces.length).toEqual(1);
      expect(workspacesContains(filteredWorkspaces, ['@scope/bar'])).toEqual(true);
    })
  });

  describe('filtering by path', () => {
    it('should filter to only names that match --onlyFs flag', () => {
      const filteredWorkspaces = filterWorkspaces(allWorkspaces, { onlyFs: 'packages/foo' });
      expect(filteredWorkspaces.length).toEqual(1);
      expect(workspacesContains(filteredWorkspaces, ['foo'])).toEqual(true);
    });
  });

});
