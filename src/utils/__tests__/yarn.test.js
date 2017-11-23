// @flow

import { getFixturePath } from 'jest-fixtures';

import * as yarn from '../yarn';
import * as processes from '../processes';
import Project from '../../Project';

jest.mock('../processes');

const unsafeProcesses: any & typeof processes = processes;

function assertSpawnCalls(expectedArgs, expectedCwd) {
  const spawnCalls = unsafeProcesses.spawn.mock.calls;

  expect(spawnCalls.length).toEqual(1);
  expect(spawnCalls[0][0]).toEqual(`${expectedCwd}/node_modules/.bin/yarn`);
  expect(spawnCalls[0][1]).toEqual(expectedArgs);
  expect(spawnCalls[0][2].cwd).toEqual(expectedCwd);
}

describe('utils/yarn', () => {
  describe('add()', () => {
    let cwd;
    let project;

    beforeEach(async () => {
      cwd = await getFixturePath(__dirname, 'simple-project');
      project = await Project.init(cwd);
    });

    it('should be able to add a dependency', async () => {
      await yarn.add(project.pkg, [{ name: 'chalk' }]);
      assertSpawnCalls(['add', 'chalk'], cwd);
    });

    it('should be able to add a dev dependency', async () => {
      await yarn.add(project.pkg, [{ name: 'chalk' }], 'devDependencies');
      assertSpawnCalls(['add', 'chalk', '--dev'], cwd);
    });

    it('should be able to add a peer dependency', async () => {
      await yarn.add(project.pkg, [{ name: 'chalk' }], 'peerDependencies');
      assertSpawnCalls(['add', 'chalk', '--peer'], cwd);
    });

    it('should be able to add an optional dependency', async () => {
      await yarn.add(project.pkg, [{ name: 'chalk' }], 'optionalDependencies');
      assertSpawnCalls(['add', 'chalk', '--optional'], cwd);
    });

    it('should be able to add dependency with versions', async () => {
      await yarn.add(project.pkg, [{ name: 'chalk', version: '^1.0.0' }]);
      assertSpawnCalls(['add', 'chalk@^1.0.0'], cwd);
    });

    it('should be able to add multiple dependencies', async () => {
      await yarn.add(project.pkg, [{ name: 'chalk' }, { name: 'left-pad' }]);
      assertSpawnCalls(['add', 'chalk', 'left-pad'], cwd);
    });
  });
  describe('run()', () => {});
  describe('init()', () => {});
});
