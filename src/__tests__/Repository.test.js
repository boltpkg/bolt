// @flow
import Repository from '../Repository';
import * as git from '../utils/git';
import * as fs from '../utils/fs';
import fixtures from 'fixturez';

const f = fixtures(__dirname);

describe('Repository', () => {
  test('Repository.init()', async () => {
    let cwd = f.copy('simple-repo');
    await expect(Repository.init(cwd)).rejects.toBeInstanceOf(Error);
    await git.initRepository({ cwd });
    let repo = await Repository.init(cwd);
    expect(repo.dir).toBe(cwd);
  });
});
