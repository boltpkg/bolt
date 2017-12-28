// @flow
import Project from '../../Project';
import Repository from '../../Repository';
import * as git from '../git';
import * as fs from '../fs';
import * as changes from '../changes';
import * as path from 'path';
import fixtures from 'fixturez';

const f = fixtures(__dirname);

function expectCommitMessage(message) {
  return { hash: expect.stringContaining(''), message };
}

async function updateConfig(config, props) {
  let prev = config.getConfig();
  let next = { ...prev, ...props };
  await config.write(next);
}

describe('changes', () => {
  test('changes.getWorkspaceVersionCommits()', async () => {
    let cwd = f.copy('simple-repo');
    await git.initRepository({ cwd });

    let project = await Project.init(cwd);
    let workspaces = await project.getWorkspaces();
    let repo = await Repository.init(cwd);

    await git.addAll({ cwd });
    await git.commit('init', { cwd });

    let fooWorkspace = workspaces[1];
    let barWorkspace = workspaces[0];
    let fooConfig = fooWorkspace.pkg.config;
    let barConfig = barWorkspace.pkg.config;

    let versionCommits1 = await changes.getWorkspaceVersionCommits(
      repo,
      workspaces
    );

    expect(versionCommits1.get(fooWorkspace)).toBe(undefined);
    expect(versionCommits1.get(barWorkspace)).toBe(undefined);

    await updateConfig(fooConfig, { version: '2.0.0' });
    await git.addAll({ cwd });
    await git.commit('foo2', { cwd });

    await updateConfig(barConfig, { version: '2.0.0' });
    await git.addAll({ cwd });
    await git.commit('bar2', { cwd });

    await updateConfig(fooConfig, { otherProp: '2.0.0' });
    await git.addAll({ cwd });
    await git.commit('foo2b', { cwd });

    await updateConfig(barConfig, { otherProp: '2.0.0' });
    await git.addAll({ cwd });
    await git.commit('bar2b', { cwd });

    let versionCommits2 = await changes.getWorkspaceVersionCommits(
      repo,
      workspaces
    );

    expect(versionCommits2.get(fooWorkspace)).toEqual(
      expectCommitMessage('foo2')
    );

    expect(versionCommits2.get(barWorkspace)).toEqual(
      expectCommitMessage('bar2')
    );
  });
});
