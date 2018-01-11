// @flow
import Repository from '../Repository';
import * as git from '../utils/git';
import * as fs from '../utils/fs';
import { copyFixtureIntoTempDir } from 'jest-fixtures';

async function copy(name) {
  return await fs.realpath(await copyFixtureIntoTempDir(__dirname, name));
}

describe('Repository', () => {
  test('Repository.init()', async () => {
    let cwd = await copy('simple-repo');
    await expect(Repository.init(cwd)).rejects.toBeInstanceOf(Error);
    await git.initRepository({ cwd });
    let repo = await Repository.init(cwd);
    expect(repo.dir).toBe(cwd);
  });
});
