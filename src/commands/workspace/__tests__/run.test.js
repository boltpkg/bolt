// @flow
import { workspaceRun, toWorkspaceRunOptions } from '../run';
import * as path from 'path';
import * as processes from '../../../utils/processes';
import fixtures from 'fixturez';

const f = fixtures(__dirname);

jest.mock('../../../utils/processes');
jest.mock('../../../utils/logger');

const unsafeProcessses: any & typeof processes = processes;

describe('bolt workspace run', () => {
  let projectDir;
  let fooWorkspaceDir;
  let barWorkspaceDir;

  beforeEach(async () => {
    projectDir = f.copy('nested-workspaces');
    fooWorkspaceDir = path.join(projectDir, 'packages', 'foo');
    barWorkspaceDir = path.join(projectDir, 'packages', 'bar');
  });

  /**
   * Note: These three tests have been skipped for now until we decide how we want to make them work.
   * The issue is described here: https://github.com/boltpkg/bolt/pull/214#issuecomment-473139778
   * Our options are:
   * - Don't have tests for this functionality
   * - Change how we pass args/flags into scripts (if we pass all of argV into toWorkspaceOptions for
   * example, we can properly mock this)
   * - Hackily modify argv in these tests
   */
  test.skip('running script that exists', async () => {
    await workspaceRun(
      toWorkspaceRunOptions(['foo', 'test'], {
        cwd: projectDir
      })
    );

    expect(unsafeProcessses.spawn).toHaveBeenCalledWith(
      'npx',
      ['yarn', 'run', '-s', 'test'],
      expect.objectContaining({ cwd: fooWorkspaceDir })
    );
  });

  test.skip('passing of script args', async () => {
    await workspaceRun(
      toWorkspaceRunOptions(['foo', 'test', '--first-arg', '--second-arg'], {
        cwd: projectDir
      })
    );
    // Ensure the extra '--' gets passed in
    expect(unsafeProcessses.spawn).toHaveBeenCalledWith(
      'npx',
      ['yarn', 'run', '-s', 'test', '--', '--first-arg', '--second-arg'],
      expect.objectContaining({ cwd: fooWorkspaceDir })
    );
  });

  test.skip('running from workspace that isnt the one we execute in', async () => {
    await workspaceRun(
      toWorkspaceRunOptions(['foo', 'test'], {
        cwd: barWorkspaceDir
      })
    );

    expect(unsafeProcessses.spawn).toHaveBeenCalledWith(
      'npx',
      ['yarn', 'run', '-s', 'test'],
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
