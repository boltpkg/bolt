// @flow
import path from 'path';
import getDependentsGraph from '../getDependentsGraph';

import { getFixturePath } from 'jest-fixtures';

describe('function/getDependentsGraph', () => {
  describe('A project with nested workspaces', async () => {
    it('should return a simplified dependents graph', async () => {
      const cwd = await getFixturePath(__dirname, 'nested-workspaces');
      const dependentsGraph = await getDependentsGraph({ cwd });
      const expectedDependents = {
        bar: ['foo', 'baz'],
        foo: [],
        baz: []
      };

      expect(dependentsGraph.size).toEqual(
        Object.keys(expectedDependents).length
      );
      Object.entries(expectedDependents).forEach(([pkg, dependents]) => {
        expect(dependentsGraph.get(pkg)).toEqual(dependents);
      });
    });
  });
});
