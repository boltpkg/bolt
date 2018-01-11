// @flow
import * as git from './utils/git';
import { BoltError } from './utils/errors';

export default class Repository {
  dir: string;

  constructor(dir: string) {
    this.dir = dir;
  }

  static async init(cwd: string) {
    let dir = await git.getRootDirectory({ cwd });

    if (!dir) {
      throw new BoltError(
        `There is no git repository in the current working directory`
      );
    }

    return new Repository(dir);
  }
}
