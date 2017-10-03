// @flow
import { workspacesExec, toWorkspacesExecOptions } from '../exec';
import { copyFixtureIntoTempDir } from 'jest-fixtures';
import * as path from 'path';
import * as processes from '../../../utils/processes';
import containDeep from 'jest-expect-contain-deep';

jest.mock('../../../utils/processes');

const unsafeProcesses: any & typeof processes = processes;
const binDir = path.join('node_modules', '.bin');

function assertSpawn(opts) {
  expect(unsafeProcesses.spawn).toHaveBeenCalledWith(
    opts.cmd,
    opts.args,
    containDeep({
      cwd: opts.cwd,
      env: {
        PATH: expect.stringContaining(opts.PATH)
      }
    })
  );
}

describe('bolt workspaces exec', () => {
  test('running in a project', async () => {
    let projectDir = await copyFixtureIntoTempDir(
      __dirname,
      'project-with-bins'
    );
    let fooWorkspaceDir = path.join(projectDir, 'packages', 'foo');
    let barWorkspaceDir = path.join(projectDir, 'packages', 'bar');
    let projectBinDir = path.join(projectDir, binDir);
    let fooBinDir = path.join(fooWorkspaceDir, binDir);
    let barBinDir = path.join(barWorkspaceDir, binDir);

    await workspacesExec(
      toWorkspacesExecOptions([], {
        cwd: projectDir,
        '--': ['dep-with-bin']
      })
    );

    expect(unsafeProcesses.spawn).toHaveBeenCalledTimes(2);
    expect(unsafeProcesses.spawn).toHaveBeenCalledWith(
      'dep-with-bin',
      [],
      containDeep({
        cwd: barWorkspaceDir,
        env: {
          PATH: expect.stringContaining(barBinDir + ':' + projectBinDir)
        }
      })
    );
    expect(unsafeProcesses.spawn).toHaveBeenCalledWith(
      'dep-with-bin',
      [],
      containDeep({
        cwd: fooWorkspaceDir,
        env: {
          PATH: expect.stringContaining(fooBinDir + ':' + projectBinDir)
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
    let barWorkspaceDir = path.join(projectDir, 'packages', 'bar');
    let projectBinDir = path.join(projectDir, binDir);
    let fooBinDir = path.join(fooWorkspaceDir, binDir);
    let barBinDir = path.join(barWorkspaceDir, binDir);

    await workspacesExec(
      toWorkspacesExecOptions([], {
        cwd: fooWorkspaceDir,
        '--': ['dep-with-bin']
      })
    );

    expect(unsafeProcesses.spawn).toHaveBeenCalledTimes(2);
    expect(unsafeProcesses.spawn).toHaveBeenCalledWith(
      'dep-with-bin',
      [],
      containDeep({
        cwd: barWorkspaceDir,
        env: {
          PATH: expect.stringContaining(barBinDir + ':' + projectBinDir)
        }
      })
    );
    expect(unsafeProcesses.spawn).toHaveBeenCalledWith(
      'dep-with-bin',
      [],
      containDeep({
        cwd: fooWorkspaceDir,
        env: {
          PATH: expect.stringContaining(fooBinDir + ':' + projectBinDir)
        }
      })
    );
  });

  test('running from inside a workspace that doesnt have the command', async () => {
    let projectDir = await copyFixtureIntoTempDir(
      __dirname,
      'project-with-bins'
    );
    let fooWorkspaceDir = path.join(projectDir, 'packages', 'foo');
    let barWorkspaceDir = path.join(projectDir, 'packages', 'bar');
    let projectBinDir = path.join(projectDir, binDir);
    let fooBinDir = path.join(fooWorkspaceDir, binDir);
    let barBinDir = path.join(barWorkspaceDir, binDir);

    await workspacesExec(
      toWorkspacesExecOptions([], {
        cwd: barWorkspaceDir,
        '--': ['dep-with-bin']
      })
    );

    expect(unsafeProcesses.spawn).toHaveBeenCalledTimes(2);
    expect(unsafeProcesses.spawn).toHaveBeenCalledWith(
      'dep-with-bin',
      [],
      containDeep({
        cwd: barWorkspaceDir,
        env: {
          PATH: expect.stringContaining(barBinDir + ':' + projectBinDir)
        }
      })
    );
    expect(unsafeProcesses.spawn).toHaveBeenCalledWith(
      'dep-with-bin',
      [],
      containDeep({
        cwd: fooWorkspaceDir,
        env: {
          PATH: expect.stringContaining(fooBinDir + ':' + projectBinDir)
        }
      })
    );
  });
});
