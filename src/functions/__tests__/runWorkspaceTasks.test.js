// @flow
import path from 'path';
import runWorkspaceTasks from '../runWorkspaceTasks';
import fixtures from 'fixturez';

const f = fixtures(__dirname);

describe('function/runWorkspaceTasks', () => {
  describe('A simple project', () => {
    it('should run task over all workspaces', async () => {
      let projectRoot = f.find('simple-project');
      let spy = jest.fn();
      await runWorkspaceTasks(
        async ({ dir, config }) => {
          spy(dir, config);
        },
        { cwd: projectRoot }
      );
      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenCalledWith(
        expect.stringContaining('__fixtures__/simple-project/packages/foo'),
        {
          name: 'foo',
          version: '1.0.0'
        }
      );
      expect(spy).toHaveBeenCalledWith(
        expect.stringContaining('__fixtures__/simple-project/packages/bar'),
        {
          name: 'bar',
          version: '1.0.0'
        }
      );
    });

    it('should run task over filtered workspaces when filterOpts is passed', async () => {
      let projectRoot = f.find('simple-project');
      let spy = jest.fn();
      await runWorkspaceTasks(
        async ({ dir, config }) => {
          spy(dir, config);
        },
        { cwd: projectRoot, filterOpts: { onlyFs: 'packages/foo' } }
      );
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(
        expect.stringContaining('__fixtures__/simple-project/packages/foo'),
        {
          name: 'foo',
          version: '1.0.0'
        }
      );
    });

    it('should run task over workspaces in correct order when spawnOpts is passed', async () => {
      let projectRoot = f.find('simple-project');
      let cases = [
        {
          spawnOpts: { orderMode: 'parallel' },
          expect: ['start:bar', 'start:foo', 'end:bar', 'end:foo']
        },
        {
          spawnOpts: { orderMode: 'serial' },
          expect: ['start:bar', 'end:bar', 'start:foo', 'end:foo']
        }
      ];
      for (let c of cases) {
        let ops = [];
        await runWorkspaceTasks(
          async ({ dir, config }) => {
            let name: string = (config: any).name;
            ops.push('start:' + name);
            // wait until next tick
            await Promise.resolve();
            ops.push('end:' + name);
          },
          { cwd: projectRoot, spawnOpts: c.spawnOpts }
        );
        expect(ops).toEqual(c.expect);
      }
    });
  });
});
