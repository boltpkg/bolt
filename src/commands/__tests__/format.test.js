// @flow
import { format, toFormatOptions } from '../format';
import { copyFixtureIntoTempDir } from 'jest-fixtures';
import * as boltRun from '../run';

jest.mock('../run');

describe('bolt format', () => {
  it('should call run with build script with no flags or arguments', async () => {
    await format(toFormatOptions([], { '--': [] }));
    expect(boltRun.run).toHaveBeenCalledWith({
      cwd: undefined,
      script: 'format',
      scriptArgs: [],
      scriptFlags: []
    });
  });

  it('should call run with build script with flags and arguments', async () => {
    await format(
      toFormatOptions(['Babel'], {
        compress: true,
        target: 'Node8',
        cwd: 'dummyPattern/dummyPath',
        '--': []
      })
    );
    expect(boltRun.run).toHaveBeenCalledWith({
      cwd: 'dummyPattern/dummyPath',
      script: 'format',
      scriptArgs: ['Babel'],
      scriptFlags: [
        '--compress',
        '--target=Node8',
        '--cwd=dummyPattern/dummyPath'
      ]
    });
  });
});
