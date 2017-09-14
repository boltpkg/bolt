// @flow
import path from 'path';
import getDependentsGraph from '../getDependentsGraph';

import { getFixturePath } from 'jest-fixtures';

describe('function/getDependentsGraph', () => {
  describe('A simple project', async () => {
    it('should return a simplified dependents graph', async () => {
      const cwd = await getFixturePath(__dirname, 'nested-workspaces');
      const dependentsGraph = await getDependentsGraph({ cwd });

      expect(dependentsGraph.get('bar')).toEqual(['foo', 'baz']);
      expect(dependentsGraph.get('foo')).toEqual([]);
      expect(dependentsGraph.get('baz')).toEqual([]);
    });
  });
});
