// @flow
import * as git from '../../utils/git';
import * as fs from '../../utils/fs';
import * as path from 'path';
import fixtures from 'fixturez';

const f = fixtures(__dirname);

function expectCommitMessages(messages) {
  return messages.map(message => {
    return {
      hash: expect.stringContaining(''),
      message
    };
  });
}

describe('git', () => {
  test('git.initRepository()', async () => {
    let cwd = f.copy('simple-repo');
    await git.initRepository({ cwd });
    let stat = await fs.stat(path.join(cwd, '.git'));
    expect(stat.isDirectory()).toBe(true);
  });

  test('git.getRootDirectory()', async () => {
    let cwd = f.copy('simple-repo');
    let dir = path.join(cwd, 'packages', 'foo');

    expect(await git.getRootDirectory({ cwd })).toBe(null);
    await git.initRepository({ cwd });
    expect(await git.getRootDirectory({ cwd })).toBe(cwd);
    expect(await git.getRootDirectory({ cwd: dir })).toBe(cwd);
  });

  test('git.status()', async () => {
    let cwd = f.copy('simple-repo');
    await git.initRepository({ cwd });
    let status = await git.status({ cwd });

    expect(status).toContain('?? package.json');
    expect(status).toContain('?? packages/');
  });

  test('git.addAll()', async () => {
    let cwd = f.copy('simple-repo');
    await git.initRepository({ cwd });
    await git.addAll({ cwd });
    let status = await git.status({ cwd });

    expect(status).toContain('A  package.json');
    expect(status).toContain('A  packages/bar/package.json');
    expect(status).toContain('A  packages/foo/package.json');
    expect(status).not.toContain('??');
  });

  test('git.addFiles()', async () => {
    let cwd = f.copy('simple-repo');
    await git.initRepository({ cwd });
    await git.addFiles([path.join(cwd, 'package.json')], { cwd });
    let status = await git.status({ cwd });

    expect(status).toContain('A  package.json');
    expect(status).toContain('?? packages/');
  });

  test('git.commit() & git.getAllCommits()', async () => {
    let cwd = f.copy('simple-repo');
    expect(await git.getAllCommits({ cwd })).toEqual(expectCommitMessages([]));

    await git.initRepository({ cwd });
    expect(await git.getAllCommits({ cwd })).toEqual(expectCommitMessages([]));

    await git.addFiles([path.join(cwd, 'package.json')], { cwd });
    await git.commit('msg', { cwd });

    let status = await git.status({ cwd });
    expect(status).not.toContain('A  package.json');
    expect(status).toContain('?? packages/');

    expect(await git.getAllCommits({ cwd })).toEqual(
      expectCommitMessages(['msg'])
    );

    await git.addFiles([path.join(cwd, 'packages')], { cwd });
    await git.commit('foo\nbar', { cwd });

    expect(await git.getAllCommits({ cwd })).toEqual(
      expectCommitMessages(['foo bar', 'msg'])
    );
  });

  test('git.listTags() & git.addTag() & git.removeTag()', async () => {
    let cwd = f.copy('simple-repo');

    expect(await git.listTags({ cwd })).toEqual([]);

    await git.initRepository({ cwd });
    expect(await git.listTags({ cwd })).toEqual([]);

    await git.addAll({ cwd });
    await git.commit('msg', { cwd });
    await git.addTag('foo', { cwd });
    await git.addTag('bar', { cwd });
    expect(await git.listTags({ cwd })).toEqual(['bar', 'foo']);

    await git.removeTag('foo', { cwd });
    expect(await git.listTags({ cwd })).toEqual(['bar']);
  });

  test('git.getCommitsToFile()', async () => {
    let cwd = f.copy('simple-repo');
    let pkg = path.join(cwd, 'package.json');
    let fooPkg = path.join(cwd, 'packages', 'foo', 'package.json');
    expect(await git.getCommitsToFile(pkg, { cwd })).toEqual(
      expectCommitMessages([])
    );

    await git.initRepository({ cwd });
    expect(await git.getCommitsToFile(pkg, { cwd })).toEqual(
      expectCommitMessages([])
    );

    await git.addAll({ cwd });
    await git.commit('msg', { cwd });
    expect(await git.getCommitsToFile(pkg, { cwd })).toEqual(
      expectCommitMessages(['msg'])
    );

    await fs.writeFile(pkg, JSON.stringify({ version: '2.0.0' }));
    await git.addAll({ cwd });
    await git.commit('pkg2', { cwd });

    await fs.writeFile(fooPkg, JSON.stringify({ version: '2.0.0' }));
    await git.addAll({ cwd });
    await git.commit('fooPkg2', { cwd });

    expect(await git.getCommitsToFile(pkg, { cwd })).toEqual(
      expectCommitMessages(['pkg2', 'msg'])
    );

    expect(await git.getCommitsToFile(fooPkg, { cwd })).toEqual(
      expectCommitMessages(['fooPkg2', 'msg'])
    );
  });

  test('git.getCommitParent()', async () => {
    let cwd = f.copy('simple-repo');
    let pkg = path.join(cwd, 'package.json');
    let pkgs = path.join(cwd, 'packages');

    await git.initRepository({ cwd });
    await git.addFiles([pkg], { cwd });
    await git.commit('msg', { cwd });
    await git.addFiles([pkgs], { cwd });
    await git.commit('pkg2', { cwd });

    let commits = await git.getAllCommits({ cwd });

    expect(await git.getCommitParent(commits[0].hash, { cwd })).toBe(
      commits[1].hash
    );
  });

  test('git.showFileAtCommit()', async () => {
    let cwd = f.copy('simple-repo');
    let pkg = path.join(cwd, 'package.json');

    await git.initRepository({ cwd });
    await git.addFiles([pkg], { cwd });
    await git.commit('one', { cwd });

    await fs.writeFile(pkg, JSON.stringify({ version: '2.0.0' }));
    await git.addAll({ cwd });
    await git.commit('two', { cwd });

    let commits = await git.getAllCommits({ cwd });
    expect(await git.showFileAtCommit(pkg, commits[1].hash, { cwd })).toContain(
      '1.0.0'
    );
    expect(await git.showFileAtCommit(pkg, commits[0].hash, { cwd })).toContain(
      '2.0.0'
    );
  });

  test('git.getDiffForPathSinceCommit()', async () => {
    let cwd = f.copy('simple-repo');
    let pkg = path.join(cwd, 'package.json');

    await git.initRepository({ cwd });
    await git.addFiles([pkg], { cwd });
    await git.commit('one', { cwd });

    await fs.writeFile(pkg, JSON.stringify({ version: '2.0.0' }));
    await git.addAll({ cwd });
    await git.commit('two', { cwd });

    let commits = await git.getAllCommits({ cwd });
    let diff = await git.getDiffForPathSinceCommit(pkg, commits[1].hash, {
      cwd
    });

    expect(diff).toContain('--- a/package.json');
    expect(diff).toContain('+++ b/package.json');
    expect(diff).toContain('@@ -1,10 +1 @@');
  });
});
