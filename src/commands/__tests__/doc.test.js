// @flow
import { doc, toDocOptions } from '../doc';
import { copyFixtureIntoTempDir } from 'jest-fixtures';
import * as boltRun from '../run';

jest.mock('../run');

describe('bolt doc', () => {
  it('should call run with build script with no flags or arguments', async () => {
    await doc(toDocOptions([], { '--': [] }));
    expect(boltRun.run).toHaveBeenCalledWith({
      cwd: undefined,
      script: 'doc',
      scriptArgs: [],
      scriptFlags: []
    });
  });

  it('should call run with build script with flags and arguments', async () => {
    await doc(
      toDocOptions(['Babel'], {
        compress: true,
        target: 'Node8',
        cwd: 'dummyPattern/dummyPath',
        '--': []
      })
    );
    expect(boltRun.run).toHaveBeenCalledWith({
      cwd: 'dummyPattern/dummyPath',
      script: 'doc',
      scriptArgs: ['Babel'],
      scriptFlags: [
        '--compress',
        '--target=Node8',
        '--cwd=dummyPattern/dummyPath'
      ]
    });
  });
});
