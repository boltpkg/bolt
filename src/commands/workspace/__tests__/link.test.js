// @flow

import { link } from '../link';
import * as path from 'path';
import * as yarn from '../../../utils/yarn';
import fixtures from 'fixturez';

const f = fixtures(__dirname);

jest.mock('../../../utils/yarn');
jest.mock('../../link');

describe('workspace link', () => {
  let projectDir;
  beforeEach(async () => {
    projectDir = f.copy('package-with-external-deps-installed');
  });

  it('should create link to package if there are no packages to link in args', async () => {
    const pathToFooWorksapce = path.join(projectDir, 'packages', 'foo');
    await link({ cwd: projectDir }, ['foo']);
    expect(yarn.cliCommand).toHaveBeenCalledWith(pathToFooWorksapce, 'link');
  });
});
