// @flow
import { test as test_, toTestOptions } from '../test';
import { copyFixtureIntoTempDir } from 'jest-fixtures';
import * as boltRun from '../run';

jest.mock('../run');

describe('bolt lint', () => {
  it('should call run with build script with no flags or arguments', async () => {
    await test_(toTestOptions([], { '--': [] }));
    expect(boltRun.run).toHaveBeenCalledWith({
      cwd: undefined,
      script: 'test',
      scriptArgs: [],
      scriptFlags: []
    });
  });

  it('should call run with build script with flags and arguments', async () => {
    await test_(
      toTestOptions(['Babel'], {
        compress: true,
        target: 'Node8',
        cwd: 'dummyPattern/dummyPath',
        '--': []
      })
    );
    expect(boltRun.run).toHaveBeenCalledWith({
      cwd: 'dummyPattern/dummyPath',
      script: 'test',
      scriptArgs: ['Babel'],
      scriptFlags: [
        '--compress',
        '--target=Node8',
        '--cwd=dummyPattern/dummyPath'
      ]
    });
  });
});
