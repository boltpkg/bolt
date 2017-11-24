// @flow
import { workspaceRun, toWorkspaceRunOptions } from '../run';
import { copyFixtureIntoTempDir } from 'jest-fixtures';
import * as path from 'path';
import * as processes from '../../../utils/processes';

jest.mock('../../../utils/processes');
jest.mock('../../../utils/logger');

const unsafeProcessses: any & typeof processes = processes;
const boltBinPath: string = path.join(process.cwd(), 'node_modules', '.bin');

describe('bolt workspace run', () => {
  let projectDir;
  let fooWorkspaceDir;
  let barWorkspaceDir;

  beforeEach(async () => {
    projectDir = await copyFixtureIntoTempDir(__dirname, 'nested-workspaces');
    fooWorkspaceDir = path.join(projectDir, 'packages', 'foo');
    barWorkspaceDir = path.join(projectDir, 'packages', 'bar');
  });

  test('running script that exists', async () => {
    await workspaceRun(
      toWorkspaceRunOptions(['foo', 'test'], {
        cwd: projectDir
      })
    );

    expect(unsafeProcessses.spawn).toHaveBeenCalledWith(
      `${boltBinPath}/yarn`,
      ['run', '-s', 'test'],
      expect.objectContaining({ cwd: fooWorkspaceDir })
    );
  });

  test('passing of script args', async () => {
    await workspaceRun(
      toWorkspaceRunOptions(['foo', 'test', '--first-arg', '--second-arg'], {
        cwd: projectDir
      })
    );

    // Ensure the extra '--' gets passed in
    expect(unsafeProcessses.spawn).toHaveBeenCalledWith(
      `${boltBinPath}/yarn`,
      ['run', '-s', 'test', '--', '--first-arg', '--second-arg'],
      expect.objectContaining({ cwd: fooWorkspaceDir })
    );
  });

  test('running from workspace that isnt the one we execute in', async () => {
    await workspaceRun(
      toWorkspaceRunOptions(['foo', 'test'], {
        cwd: barWorkspaceDir
      })
    );

    expect(unsafeProcessses.spawn).toHaveBeenCalledWith(
      `${boltBinPath}/yarn`,
      ['run', '-s', 'test'],
      expect.objectContaining({ cwd: fooWorkspaceDir })
    );
  });

  test('running script that doesnt exist should throw', async () => {
    await expect(
      workspaceRun(
        toWorkspaceRunOptions(['foo', 'explode'], {
          cwd: projectDir
        })
      )
    ).rejects.toBeInstanceOf(Error);
  });
});
