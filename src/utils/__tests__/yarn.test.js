// @flow

import { getFixturePath } from 'jest-fixtures';
import projectBinPath from 'project-bin-path';
import * as path from 'path';
import * as yarn from '../yarn';
import * as processes from '../processes';
import Project from '../../Project';

jest.mock('../processes');

async function getLocalBinPath(): Promise<string> {
  return await projectBinPath();
}
const unsafeProcesses: any & typeof processes = processes;

function assertSpawnCalls(expectedProcess, expectedArgs, expectedCwd) {
  const spawnCalls = unsafeProcesses.spawn.mock.calls;

  expect(spawnCalls.length).toEqual(1);
  expect(spawnCalls[0][0]).toEqual(expectedProcess);
  expect(spawnCalls[0][1]).toEqual(expectedArgs);
  expect(spawnCalls[0][2].cwd).toEqual(expectedCwd);
}

describe('utils/yarn', () => {
  describe('add()', () => {
    let cwd;
    let project;
    let localYarn;

    beforeEach(async () => {
      cwd = await getFixturePath(__dirname, 'simple-project');
      project = await Project.init(cwd);
      localYarn = path.join(await getLocalBinPath(), 'yarn');
    });

    it('should be able to add a dependency', async () => {
      await yarn.add(project.pkg, [{ name: 'chalk' }]);
      assertSpawnCalls(localYarn, ['add', 'chalk'], cwd);
    });

    it('should be able to add a dev dependency', async () => {
      await yarn.add(project.pkg, [{ name: 'chalk' }], 'devDependencies');
      assertSpawnCalls(localYarn, ['add', 'chalk', '--dev'], cwd);
    });

    it('should be able to add a peer dependency', async () => {
      await yarn.add(project.pkg, [{ name: 'chalk' }], 'peerDependencies');
      assertSpawnCalls(localYarn, ['add', 'chalk', '--peer'], cwd);
    });

    it('should be able to add an optional dependency', async () => {
      await yarn.add(project.pkg, [{ name: 'chalk' }], 'optionalDependencies');
      assertSpawnCalls(localYarn, ['add', 'chalk', '--optional'], cwd);
    });

    it('should be able to add dependency with versions', async () => {
      await yarn.add(project.pkg, [{ name: 'chalk', version: '^1.0.0' }]);
      assertSpawnCalls(localYarn, ['add', 'chalk@^1.0.0'], cwd);
    });

    it('should be able to add multiple dependencies', async () => {
      await yarn.add(project.pkg, [{ name: 'chalk' }, { name: 'left-pad' }]);
      assertSpawnCalls(localYarn, ['add', 'chalk', 'left-pad'], cwd);
    });
  });
  describe('run()', () => {});
  describe('init()', () => {});
});
