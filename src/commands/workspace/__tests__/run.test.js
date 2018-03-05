// @flow
import { workspaceRun } from '../run';
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
    relativeYarn = pkgDir => path.relative(pkgDir, localYarn);
  });

  test('running script that exists', async () => {
    await workspaceRun(
      {
        cwd: projectDir
      },
      ['foo', 'test']
    );
    const expectedRelativeYarnPath = relativeYarn(fooWorkspaceDir);

    expect(unsafeProcessses.spawn).toHaveBeenCalledWith(
      expectedRelativeYarnPath,
      ['run', '-s', 'test'],
      expect.objectContaining({ cwd: fooWorkspaceDir })
    );
  });

  test('passing of script args', async () => {
    await workspaceRun(
      {
        cwd: projectDir
      },
      ['foo', 'test', '--first-arg', '--second-arg']
    );
    const expectedRelativeYarnPath = relativeYarn(fooWorkspaceDir);

    // Ensure the extra '--' gets passed in
    expect(unsafeProcessses.spawn).toHaveBeenCalledWith(
      expectedRelativeYarnPath,
      ['run', '-s', 'test', '--', '--first-arg', '--second-arg'],
      expect.objectContaining({ cwd: fooWorkspaceDir })
    );
  });

  test('running from workspace that isnt the one we execute in', async () => {
    await workspaceRun(
      {
        cwd: barWorkspaceDir
      },
      ['foo', 'test']
    );
    const expectedRelativeYarnPath = relativeYarn(fooWorkspaceDir);

    expect(unsafeProcessses.spawn).toHaveBeenCalledWith(
      expectedRelativeYarnPath,
      ['run', '-s', 'test'],
      expect.objectContaining({ cwd: fooWorkspaceDir })
    );
  });

  test('running script that doesnt exist should throw', async () => {
    await expect(
      workspaceRun(
        {
          cwd: projectDir
        },
        ['foo', 'explode']
      )
    ).rejects.toBeInstanceOf(Error);
  });
});
