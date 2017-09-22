// @flow
import { projectExec, toProjectExecOptions } from '../exec';
import { copyFixtureIntoTempDir } from 'jest-fixtures';
import * as path from 'path';
import * as processes from '../../../utils/processes';
import containDeep from 'jest-expect-contain-deep';

jest.mock('../../../utils/processes');
const unsafeProcesses: any & typeof processes = processes;
const binDir = path.join('node_modules', '.bin');

describe('pyarn project exec', () => {
  test('running in a project', async () => {
    let projectDir = await copyFixtureIntoTempDir(
      __dirname,
      'project-with-bins'
    );
    let projectBinDir = path.join(projectDir, binDir);

    await projectExec(
      toProjectExecOptions([], {
        cwd: projectDir,
        '--': ['dep-with-bin']
      })
    );

    expect(unsafeProcesses.spawn).toHaveBeenCalledTimes(1);
    expect(unsafeProcesses.spawn).toHaveBeenCalledWith(
      'dep-with-bin',
      [],
      containDeep({
        cwd: projectDir,
        env: {
          PATH: expect.stringContaining(projectBinDir)
        }
      })
    );
  });

  test('running from inside a workspace', async () => {
    let projectDir = await copyFixtureIntoTempDir(
      __dirname,
      'project-with-bins'
    );
    let fooWorkspaceDir = path.join(projectDir, 'packages', 'foo');
    let projectBinDir = path.join(projectDir, binDir);

    await projectExec(
      toProjectExecOptions([], {
        cwd: fooWorkspaceDir,
        '--': ['dep-with-bin']
      })
    );

    expect(unsafeProcesses.spawn).toHaveBeenCalledTimes(1);
    expect(unsafeProcesses.spawn).toHaveBeenCalledWith(
      'dep-with-bin',
      [],
      containDeep({
        cwd: projectDir,
        env: {
          PATH: expect.stringContaining(projectBinDir)
        }
      })
    );
  });
});
