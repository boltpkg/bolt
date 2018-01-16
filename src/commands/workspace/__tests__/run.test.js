// @flow
import { workspaceRun, toWorkspaceRunOptions } from '../run';
import projectBinPath from 'project-bin-path';
import * as path from 'path';
import * as processes from '../../../utils/processes';
import fixtures from 'fixturez';

const f = fixtures(__dirname);

jest.mock('../../../utils/processes');
jest.mock('../../../utils/logger');

async function getLocalBinPath(): Promise<string> {
  return await projectBinPath();
}
const unsafeProcessses: any & typeof processes = processes;

describe('bolt workspace run', () => {
  let projectDir;
  let fooWorkspaceDir;
  let barWorkspaceDir;
  let localYarn;
  let relativeYarn;

  beforeEach(async () => {
    projectDir = f.copy('nested-workspaces');
    fooWorkspaceDir = path.join(projectDir, 'packages', 'foo');
    barWorkspaceDir = path.join(projectDir, 'packages', 'bar');
    localYarn = path.join(await getLocalBinPath(), 'yarn');
    relativeYarn = path.relative(projectDir, localYarn);
  });

  test('running script that exists', async () => {
    await workspaceRun(
      toWorkspaceRunOptions(['foo', 'test'], {
        cwd: projectDir
      })
    );

    expect(unsafeProcessses.spawn).toHaveBeenCalledWith(
      relativeYarn,
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
      relativeYarn,
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
      relativeYarn,
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
