// @flow
import { lint, toLintOptions } from '../lint';
import { copyFixtureIntoTempDir } from 'jest-fixtures';
import * as boltRun from '../run';

jest.mock('../run');

describe('bolt lint', () => {
  it('should call run with build script with no flags or arguments', async () => {
    await lint(toLintOptions([], { '--': [] }));
    expect(boltRun.run).toHaveBeenCalledWith({
      cwd: undefined,
      script: 'lint',
      scriptArgs: [],
      scriptFlags: []
    });
  });

  it('should call run with build script with flags and arguments', async () => {
    await lint(
      toLintOptions(['Babel'], {
        compress: true,
        target: 'Node8',
        cwd: 'dummyPattern/dummyPath',
        '--': []
      })
    );
    expect(boltRun.run).toHaveBeenCalledWith({
      cwd: 'dummyPattern/dummyPath',
      script: 'lint',
      scriptArgs: ['Babel'],
      scriptFlags: [
        '--compress',
        '--target=Node8',
        '--cwd=dummyPattern/dummyPath'
      ]
    });
  });
});
