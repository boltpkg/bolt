// @flow
import { check, toCheckOptions } from '../check';
import { copyFixtureIntoTempDir } from 'jest-fixtures';
import * as boltRun from '../run';

jest.mock('../run');

describe('bolt check', () => {
  it('should call run with build script with no flags or arguments', async () => {
    await check(toCheckOptions([], { '--': [] }));
    expect(boltRun.run).toHaveBeenCalledWith({
      cwd: undefined,
      script: 'check',
      scriptArgs: [],
      scriptFlags: []
    });
  });

  it('should call run with build script with flags and arguments', async () => {
    await check(
      toCheckOptions(['Babel'], {
        compress: true,
        target: 'Node8',
        cwd: 'dummyPattern/dummyPath',
        '--': []
      })
    );
    expect(boltRun.run).toHaveBeenCalledWith({
      cwd: 'dummyPattern/dummyPath',
      script: 'check',
      scriptArgs: ['Babel'],
      scriptFlags: [
        '--compress',
        '--target=Node8',
        '--cwd=dummyPattern/dummyPath'
      ]
    });
  });
});
