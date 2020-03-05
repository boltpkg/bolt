// @flow
import path from 'path';
import getDependentsGraph from '../getDependentsGraph';
import fixtures from 'fixturez';

const f = fixtures(__dirname);

describe('function/getDependentsGraph', () => {
  describe('A project with nested workspaces', () => {
    it('should return a simplified dependents graph', async () => {
      let cwd = f.find('nested-workspaces');
      let dependentsGraph = await getDependentsGraph({ cwd });
      let expectedDependents = {
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
