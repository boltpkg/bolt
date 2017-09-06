// @flow
import {install, toInstallOptions} from '../install';
import * as processes from '../../utils/processes';
import * as path from 'path';
import * as fs from '../../utils/fs';
import {getFixturePath} from 'jest-fixtures';

jest.mock('../../utils/processes');
jest.mock('../../utils/logger');
jest.unmock('../install');

const unsafeProcesses: any & typeof processes = processes;

describe('install', () => {
  let readdirSpy;

  beforeEach(() => {
    readdirSpy = jest.spyOn(fs, 'readdir').mockImplementation(() => Promise.resolve([]));
  });

  afterEach(() => {
    readdirSpy.mockRestore();
  });

  test('simple-package', async () => {
    let cwd = await getFixturePath(__dirname, 'simple-package');
    await install(toInstallOptions([], { cwd }));
    expect(unsafeProcesses.spawn).toHaveBeenCalledWith(
      'yarn',
      ['install', '--non-interactive', '-s'],
      { cwd }
    );
  });
});
